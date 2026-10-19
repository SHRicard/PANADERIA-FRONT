import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useActualizarInsumoMutation, useCrearInsumoMutation, useObtenerInsumoQuery } from '../api/insumosApi';
import { aEscrita, deEscrita, hoy } from '../fechas';
import { formularioInsumoSchema } from '../schemas';
import type { DatosInsumo, FormularioInsumo, InsumoConHistorial, ModoFormularioInsumo } from '../types';

/** Con qué arranca el formulario en cada modo */
function inicial(modo: ModoFormularioInsumo, insumo: InsumoConHistorial | undefined): FormularioInsumo {
  // La cantidad se escribe con coma: 0.5 → "0,5". Los insumos de antes no la tienen: arranca vacía
  const cantidad = insumo?.cantidad !== undefined ? String(insumo.cantidad).replace('.', ',') : '';
  const unidad = insumo?.unidad ?? 'kg';
  if (modo === 'corregir' && insumo) {
    return { nombre: insumo.nombre, precio: String(insumo.precio), cantidad, unidad, fecha: aEscrita(insumo.fecha) };
  }
  // Una compra nueva arranca sin precio, con la fecha de hoy y la misma cantidad que la última (casi siempre es la
  // misma bolsa). El nombre no se toca (no se muestra)
  if (modo === 'compra' && insumo) return { nombre: insumo.nombre, precio: '', cantidad, unidad, fecha: aEscrita(hoy()) };
  return { nombre: '', precio: '', cantidad: '', unidad: 'kg', fecha: aEscrita(hoy()) };
}

/**
 * El formulario de insumos: el alta, una compra nueva (precio, cuánto vino y fecha) o una corrección. En compra y corrección,
 * el insumo ya está en la caché (se llega desde su detalle)
 */
export function useFormularioInsumo(modo: ModoFormularioInsumo, id?: string) {
  const router = useRouter();
  const consulta = useObtenerInsumoQuery(id ?? '', { skip: modo === 'nuevo' || !id });
  const insumo = consulta.data;
  const [crearInsumo, { isLoading: creando }] = useCrearInsumoMutation();
  const [actualizarInsumo, { isLoading: actualizando }] = useActualizarInsumoMutation();
  const [error, setError] = useState<string | null>(null);

  const valores = useMemo(() => inicial(modo, insumo), [modo, insumo]);
  const form = useForm<FormularioInsumo>({
    resolver: zodResolver(formularioInsumoSchema),
    defaultValues: valores,
    // Se llena apenas llega el insumo, si no estaba en la caché
    values: modo === 'nuevo' ? undefined : valores,
  });

  const guardar = form.handleSubmit(async ({ nombre, precio, cantidad, unidad, fecha }) => {
    setError(null);
    // El schema ya validó la fecha y la cantidad
    const datos: DatosInsumo = {
      nombre,
      precio: Number(precio),
      cantidad: Number(cantidad.replace(',', '.')),
      unidad,
      fecha: deEscrita(fecha) ?? hoy(),
    };
    try {
      if (modo === 'nuevo') {
        const creado = await crearInsumo(datos).unwrap();
        router.replace({ pathname: '/insumos/[id]', params: { id: creado._id } });
        return;
      }
      if (!insumo || !id) return;
      // Solo lo que cambió. En una compra, el nombre no viaja
      const cambios: Partial<DatosInsumo> = {};
      if (modo === 'corregir' && datos.nombre !== insumo.nombre) cambios.nombre = datos.nombre;
      if (datos.precio !== insumo.precio) cambios.precio = datos.precio;
      if (datos.fecha !== insumo.fecha) cambios.fecha = datos.fecha;
      // Cantidad y unidad viajan juntas: el back rechaza una sin la otra
      if (datos.cantidad !== insumo.cantidad || datos.unidad !== insumo.unidad) {
        cambios.cantidad = datos.cantidad;
        cambios.unidad = datos.unidad;
      }
      if (Object.keys(cambios).length === 0) {
        setError(modo === 'compra' ? 'Es la misma compra que la última: mismo precio, cantidad y fecha.' : 'No cambiaste nada.');
        return;
      }
      await actualizarInsumo({ id, cambios }).unwrap();
      router.back();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  return {
    form,
    guardar,
    guardando: creando || actualizando,
    error,
    insumo,
    /** En una compra nueva el nombre no se edita */
    pideNombre: modo !== 'compra',
    cargando: modo !== 'nuevo' && consulta.isLoading,
    errorCarga: consulta.isError ? mensajeDeError(consulta.error) : null,
  };
}
