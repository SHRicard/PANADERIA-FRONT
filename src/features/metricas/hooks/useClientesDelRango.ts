import { mensajeDeError } from '@/services/api';
import { useClientesDelRangoQuery } from '../api/metricasApi';
import { rangoDe, type Periodo } from '../rangos';

/** Los clientes que compraron en el período: los nuevos, los que volvieron y los que compraron más de una vez */
export function useClientesDelRango(periodo: Periodo) {
  const consulta = useClientesDelRangoQuery(rangoDe(periodo));
  // Si falla al cambiar de período, data todavía es la del anterior: no se muestra con el nombre del nuevo
  const clientes = consulta.isError ? consulta.currentData : consulta.data;

  return {
    clientes,
    cargando: consulta.isLoading,
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !clientes ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
