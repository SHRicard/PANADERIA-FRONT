import { mensajeDeError } from '@/services/api';
import { useBalanceQuery } from '../api/metricasApi';
import { AGRUPAR_DEL_PERIODO, rangoDe, type Periodo } from '../rangos';

/** Lo que entró por ventas, lo que salió en insumos y la ganancia del período, con la serie para el gráfico */
export function useBalance(periodo: Periodo) {
  const consulta = useBalanceQuery({ ...rangoDe(periodo), agrupar: AGRUPAR_DEL_PERIODO[periodo] });
  // Si falla al cambiar de período, data todavía es la del anterior: no se muestra con el nombre del nuevo
  const balance = consulta.isError ? consulta.currentData : consulta.data;

  return {
    balance,
    cargando: consulta.isLoading,
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !balance ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
