import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { textoCantidad, useListarInsumosQuery } from '@/features/insumos';
import { mensajeDeError } from '@/services/api';
import type { OpcionSelect } from '@/shared/ui/atoms';
import { esSinReceta, useGuardarRecetaMutation, useObtenerRecetaQuery } from '../api/recetasApi';
import { formularioRecetaSchema, INGREDIENTES_MAX, NO_SE_COMPRA } from '../schemas';
import type { DatosReceta, FormularioReceta, Receta, UnidadReceta } from '../types';

const INGREDIENTE_VACIO: FormularioReceta['ingredientes'][number] = { eleccion: '', nombre: '', unidad: 'g', cantidad: '' };

/** Con qué arranca: la receta guardada o una vacía con un ingrediente */
function inicial(receta: Receta | undefined): FormularioReceta {
  if (!receta) return { rinde: '', ingredientes: [INGREDIENTE_VACIO] };
  return {
    rinde: String(receta.rinde),
    ingredientes: receta.ingredientes.map((ingrediente) => ({
      eleccion: ingrediente.insumo ?? NO_SE_COMPRA,
      nombre: ingrediente.insumo ? '' : ingrediente.nombre,
      unidad: ingrediente.unidad,
      cantidad: String(ingrediente.cantidad),
    })),
  };
}

/**
 * El formulario de la receta: la carga la primera vez o la reemplaza entera. Los ingredientes se eligen de los
 * insumos (la unidad sale del insumo: kg y l en gramos, unidad en unidades) o son algo que no se compra (el agua)
 */
export function useFormularioReceta(productoId: string) {
  const router = useRouter();
  const consulta = useObtenerRecetaQuery(productoId);
  const sinReceta = esSinReceta(consulta.error);
  const receta = sinReceta ? undefined : consulta.data;
  const consultaInsumos = useListarInsumosQuery();
  const [guardarReceta, { isLoading: guardando }] = useGuardarRecetaMutation();
  const [error, setError] = useState<string | null>(null);

  const valores = useMemo(() => inicial(receta), [receta]);
  const form = useForm<FormularioReceta>({
    resolver: zodResolver(formularioRecetaSchema),
    defaultValues: valores,
    // Al editar, se llena apenas llega la receta. Si la caché cambia, no pisa lo que el dueño ya escribió
    values: receta ? valores : undefined,
    resetOptions: { keepDirtyValues: true },
  });
  const lista = useFieldArray({ control: form.control, name: 'ingredientes' });

  // Solo los insumos que dicen cuánto trae la bolsa: sin eso no se sabe si "1000" son gramos o unidades (el back
  // los rechaza). Los otros se avisan arriba
  const { opciones, unidades, incompletos } = useMemo(() => {
    const insumos = consultaInsumos.data ?? [];
    const usables = insumos.flatMap(({ _id, nombre, cantidad, unidad }) =>
      cantidad !== undefined && unidad !== undefined ? [{ _id, nombre, cantidad, unidad }] : []
    );
    const lista: OpcionSelect<string>[] = usables.map((insumo) => ({
      valor: insumo._id,
      label: insumo.nombre,
      detalle: textoCantidad(insumo.cantidad, insumo.unidad),
    }));
    lista.push({ valor: NO_SE_COMPRA, label: 'Algo que no se compra', detalle: 'Agua…' });
    return {
      opciones: lista,
      // kg y l se cargan en gramos (el dueño pesa todo, también los líquidos); unidad, en unidades
      unidades: new Map(usables.map((insumo): [string, UnidadReceta] => [insumo._id, insumo.unidad === 'unidad' ? 'unidad' : 'g'])),
      incompletos: insumos.length - usables.length,
    };
  }, [consultaInsumos.data]);

  const guardar = form.handleSubmit(async ({ rinde, ingredientes }) => {
    setError(null);
    // El schema ya validó los números. La unidad de un insumo no viaja: la pone el back
    const datos: DatosReceta = {
      rinde: Number(rinde),
      ingredientes: ingredientes.map(({ eleccion, nombre, unidad, cantidad }) =>
        eleccion === NO_SE_COMPRA
          ? { nombre: nombre.trim(), unidad, cantidad: Number(cantidad) }
          : { insumo: eleccion, cantidad: Number(cantidad) }
      ),
    };
    try {
      await guardarReceta({ productoId, datos }).unwrap();
      // Ya está en la caché: si se vino de la receta, se vuelve a ella; si era nueva, se abre
      if (receta) router.back();
      else router.replace({ pathname: '/productos/[id]/receta', params: { id: productoId } });
    } catch (e) {
      // Un insumo sin cantidad, repetido o que ya no existe llega con el mensaje del back
      setError(mensajeDeError(e));
    }
  });

  const errores = form.formState.errors.ingredientes;
  return {
    form,
    campos: lista.fields,
    agregar: () => lista.append(INGREDIENTE_VACIO),
    quitar: (indice: number) => lista.remove(indice),
    puedeAgregar: lista.fields.length < INGREDIENTES_MAX,
    opciones,
    /** La unidad del insumo elegido; undefined si no está en la lista */
    unidadDeInsumo: (id: string) => unidades.get(id),
    /** Cuántos insumos no se pueden elegir porque no dicen cuánto trae la bolsa */
    incompletos,
    /** El error de la lista entera (sin ingredientes) */
    errorLista: errores?.message ?? errores?.root?.message,
    guardar,
    guardando,
    error,
    esNueva: !receta,
    // Ante un error que no es el 404 no se muestra el formulario: arrancaría vacío y pisaría la receta al guardar
    cargando: consulta.isLoading || consultaInsumos.isLoading,
    errorCarga:
      consulta.error && !sinReceta
        ? mensajeDeError(consulta.error)
        : consultaInsumos.isError && !consultaInsumos.data
          ? mensajeDeError(consultaInsumos.error)
          : null,
    reintentar: () => {
      void consulta.refetch();
      void consultaInsumos.refetch();
    },
  };
}
