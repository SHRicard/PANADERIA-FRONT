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
  if (modo === 'corregir' && insumo) {
    return { nombre: insumo.nombre, precio: String(insumo.precio), fecha: aEscrita(insumo.fecha) };
  }
  // Una compra nueva arranca vacía y con la fecha de hoy. El nombre no se toca (no se muestra)
  return { nombre: modo === 'compra' && insumo ? insumo.nombre : '', precio: '', fecha: aEscrita(hoy()) };
}

/**
 * El formulario de insumos: el alta, una compra nueva (precio y fecha) o una corrección. En compra y corrección,
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

  const guardar = form.handleSubmit(async ({ nombre, precio, fecha }) => {
    setError(null);
    // El schema ya validó la fecha
    const datos: DatosInsumo = { nombre, precio: Number(precio), fecha: deEscrita(fecha) ?? hoy() };
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
      if (Object.keys(cambios).length === 0) {
        setError(modo === 'compra' ? 'Es el mismo precio y la misma fecha de la última compra.' : 'No cambiaste nada.');
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
