import { mensajeDeError } from '@/services/api';
import { useGustosMasVendidosQuery } from '../api/metricasApi';
import { rangoDe, type Periodo } from '../rangos';
import type { GustoVendido, OrdenProductos } from '../types';

/** Lo vendido de cada gusto en el período, del que más se vende al que menos */
export function useGustosMasVendidos(periodo: Periodo, orden: OrdenProductos = 'unidades') {
  const consulta = useGustosMasVendidosQuery({ ...rangoDe(periodo), orden });
  // Si falla al cambiar de período, data todavía es la del anterior: no se muestra con el nombre del nuevo
  const datos = consulta.isError ? consulta.currentData : consulta.data;
  const gustos = datos?.gustos ?? [];
  const total = orden === 'unidades' ? (datos?.totalUnidades ?? 0) : (datos?.totalImporte ?? 0);

  return {
    /** Los que vendieron algo, en el orden del back */
    vendidos: gustos.filter((gusto) => gusto.unidades > 0),
    /** Los de la lista que no se vendieron en el período: el back los manda en 0 */
    sinVentas: gustos.filter((gusto) => gusto.unidades === 0).map((gusto) => gusto.gusto),
    totalPedidos: datos?.totalPedidos ?? 0,
    totalUnidades: datos?.totalUnidades ?? 0,
    totalImporte: datos?.totalImporte ?? 0,
    /** Qué parte del total del período es este gusto, de 0 a 100, según el orden elegido */
    porcentaje: (gusto: GustoVendido) =>
      total > 0 ? Math.round(((orden === 'unidades' ? gusto.unidades : gusto.importe) / total) * 100) : 0,
    cargando: consulta.isLoading,
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !datos ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
