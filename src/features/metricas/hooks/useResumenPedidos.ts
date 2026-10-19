import { mensajeDeError } from '@/services/api';
import { useResumenPedidosQuery } from '../api/metricasApi';
import { rangoDe, type Periodo } from '../rangos';

/** Los pedidos hechos en el período: por estado, de dónde llegan, el ticket promedio, las cancelaciones y los días */
export function useResumenPedidos(periodo: Periodo) {
  const consulta = useResumenPedidosQuery(rangoDe(periodo));
  // Si falla al cambiar de período, data todavía es la del anterior: no se muestra con el nombre del nuevo
  const resumen = consulta.isError ? consulta.currentData : consulta.data;
  const dias = resumen?.porDiaDeLaSemana ?? [];

  return {
    resumen,
    /** El día con más pedidos; con empate, el primero de la semana. null si no hubo pedidos */
    diaConMasPedidos: dias.reduce<(typeof dias)[number] | null>(
      (mejor, dia) => (dia.pedidos > (mejor?.pedidos ?? 0) ? dia : mejor),
      null
    ),
    cargando: consulta.isLoading,
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !resumen ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
