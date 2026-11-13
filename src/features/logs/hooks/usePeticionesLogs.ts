import { useMemo, useState } from 'react';
import { mensajeDeError } from '@/services/api';
import { useListarLogsInfiniteQuery } from '../api/logsApi';
import { filtrosDe, type FiltroPeticiones } from '../textos';
import type { IpFiltrada } from './useLogs';

/** Las peticiones sueltas a la API, de a páginas, con el filtro del Select y, si se eligió, una sola IP */
export function usePeticionesLogs(ip: IpFiltrada | null, activa: boolean) {
  const [filtro, setFiltro] = useState<FiltroPeticiones>('todas');

  // Hasta que se abre la vista de peticiones, no se pide
  const consulta = useListarLogsInfiniteQuery(filtrosDe(filtro, ip?.ip ?? null), { refetchOnMountOrArgChange: true, skip: !activa });
  // currentData y no data: al cambiar de filtro no se ve la lista del filtro anterior mientras carga
  const paginas = consulta.currentData?.pages;
  const logs = useMemo(() => paginas?.flatMap((pagina) => pagina.logs) ?? [], [paginas]);

  return {
    logs,
    total: paginas?.[0]?.totalLogs ?? 0,
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
  };
}
