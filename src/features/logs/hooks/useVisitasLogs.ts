import { useMemo, useState } from 'react';
import { mensajeDeError } from '@/services/api';
import { useListarVisitasInfiniteQuery } from '../api/logsApi';
import type { FiltroSospecha } from '../textos';
import type { IpFiltrada } from './useLogs';

/**
 * Las visitas: las peticiones de una IP juntas mientras no pasen 30 minutos sin actividad (lo arma el back). De a
 * páginas, todas o solo las que tuvieron alguna sospechosa y, si se eligió, de una sola IP
 */
export function useVisitasLogs(ip: IpFiltrada | null, activa: boolean) {
  const [filtro, setFiltro] = useState<FiltroSospecha>('todas');
  const consulta = useListarVisitasInfiniteQuery(
    { ip: ip?.ip, sospechosas: filtro === 'sospechosas' ? true : undefined },
    { refetchOnMountOrArgChange: true, skip: !activa }
  );
  const paginas = consulta.currentData?.pages;
  const visitas = useMemo(() => paginas?.flatMap((pagina) => pagina.visitas) ?? [], [paginas]);

  return {
    visitas,
    total: paginas?.[0]?.totalVisitas ?? 0,
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
