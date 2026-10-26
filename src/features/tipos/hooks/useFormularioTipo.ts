import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useCrearTipoMutation, useListarTiposQuery, useRenombrarTipoMutation } from '../api/tiposApi';
import { formularioTipoSchema } from '../schemas';
import type { FormularioTipo } from '../types';

const VACIO: FormularioTipo = { nombre: '' };

/**
 * El formulario de tipos: sin id, el alta; con id, el renombre. No hay GET de uno solo: sale de la lista, que ya
 * está en la caché (se llega desde ahí)
 */
export function useFormularioTipo(id?: string) {
  const router = useRouter();
  const esNuevo = !id;
  const consulta = useListarTiposQuery(undefined, { skip: esNuevo });
  const tipo = esNuevo ? undefined : consulta.data?.find(({ _id }) => _id === id);
  const [crearTipo, { isLoading: creando }] = useCrearTipoMutation();
  const [renombrarTipo, { isLoading: renombrando }] = useRenombrarTipoMutation();
  const [error, setError] = useState<string | null>(null);

  const valores = useMemo(() => (tipo ? { nombre: tipo.nombre } : undefined), [tipo]);
  const form = useForm<FormularioTipo>({
    resolver: zodResolver(formularioTipoSchema),
    defaultValues: VACIO,
    // En el renombre se llena apenas está el tipo. Si la caché cambia, no pisa lo que el dueño ya escribió
    values: valores,
    resetOptions: { keepDirtyValues: true },
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/tipos'));

  const guardar = form.handleSubmit(async ({ nombre }) => {
    setError(null);
    try {
      if (esNuevo) {
        await crearTipo(nombre).unwrap();
        volver();
        return;
      }
      if (!tipo) return;
      if (nombre === tipo.nombre) {
        setError('No cambiaste nada.');
        return;
      }
      await renombrarTipo({ id: tipo._id, nombre }).unwrap();
      volver();
    } catch (e) {
      // Un nombre repetido (409) llega con el mensaje del back: «Ya existe un tipo con ese nombre: «Tortas»»
      setError(mensajeDeError(e));
    }
  });

  return {
    form,
    guardar,
    guardando: creando || renombrando,
    error,
    tipo,
    cargando: !esNuevo && !tipo && consulta.isLoading,
    /** Un id que no está en la lista: lo borraron o el link es viejo */
    noExiste: !esNuevo && !tipo && consulta.isSuccess,
    errorCarga: consulta.isError && !consulta.data ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    volver,
  };
}
