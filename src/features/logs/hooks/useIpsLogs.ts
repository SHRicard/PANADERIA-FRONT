import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useListarIpsLogsInfiniteQuery, useNombrarIpMutation, useOlvidarIpMutation } from '../api/logsApi';
import { formularioNombreIpSchema } from '../schemas';
import type { FiltroSospecha } from '../textos';
import type { FormularioNombreIp, IpLog } from '../types';

/** Las IP que usaron la API, de a páginas, y el nombre que les pone el dueño («Juan», «La compu del local») */
export function useIpsLogs(activa: boolean) {
  const [filtro, setFiltro] = useState<FiltroSospecha>('todas');
  // Hasta que se abre la vista de IP, no se pide
  const consulta = useListarIpsLogsInfiniteQuery(filtro === 'sospechosas' ? { sospechosas: true } : {}, {
    refetchOnMountOrArgChange: true,
    skip: !activa,
  });
  const paginas = consulta.currentData?.pages;
  const ips = useMemo(() => paginas?.flatMap((pagina) => pagina.ips) ?? [], [paginas]);

  const [nombrarIp, nombrado] = useNombrarIpMutation();
  const [olvidarIp] = useOlvidarIpMutation();
  // La IP a la que se le está poniendo nombre (la hoja abierta) y la que se le está sacando
  const [editando, setEditando] = useState<IpLog | null>(null);
  const [olvidando, setOlvidando] = useState<string | null>(null);
  const [errorNombre, setErrorNombre] = useState<string | null>(null);
  const [errorOlvidar, setErrorOlvidar] = useState<string | null>(null);

  const form = useForm<FormularioNombreIp>({
    resolver: zodResolver(formularioNombreIpSchema),
    defaultValues: { nombre: '' },
  });

  const guardarNombre = form.handleSubmit(async ({ nombre }) => {
    if (!editando) return;
    setErrorNombre(null);
    try {
      await nombrarIp({ ip: editando.ip, nombre: nombre.trim() }).unwrap();
      setEditando(null);
    } catch (e) {
      setErrorNombre(mensajeDeError(e));
    }
  });

  return {
    ips,
    total: paginas?.[0]?.totalIps ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    cargandoMas: consulta.isFetchingNextPage,
    cargarMas: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },

    filtro,
    setFiltro,

    nombre: {
      /** La IP de la hoja abierta */
      ip: editando,
      form,
      editar: (ip: IpLog) => {
        setErrorNombre(null);
        form.reset({ nombre: ip.nombre ?? '' });
        setEditando(ip);
      },
      cerrar: () => setEditando(null),
      guardar: guardarNombre,
      guardando: nombrado.isLoading,
      error: errorNombre,
    },

    /** La IP a la que se le está sacando el nombre */
    olvidando,
    errorOlvidar,
    olvidar: async (ip: IpLog) => {
      setErrorOlvidar(null);
      setOlvidando(ip.ip);
      try {
        await olvidarIp(ip.ip).unwrap();
      } catch (e) {
        setErrorOlvidar(mensajeDeError(e));
      } finally {
        setOlvidando(null);
      }
    },
  };
}
