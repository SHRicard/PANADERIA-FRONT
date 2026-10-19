import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useGastoEnInsumosQuery } from '../api/metricasApi';
import { rangoDe, type Periodo } from '../rangos';
import type { GastoInsumo } from '../types';

/** En qué insumos se gastó más en el período, y cuánto aumentó cada uno respecto de la compra anterior */
export function useGastoEnInsumos(periodo: Periodo) {
  const router = useRouter();
  const consulta = useGastoEnInsumosQuery(rangoDe(periodo));
  const datos = consulta.isError ? consulta.currentData : consulta.data;

  return {
    insumos: datos?.insumos ?? [],
    totalGastado: datos?.totalGastado ?? 0,
    totalCompras: datos?.totalCompras ?? 0,
    /** Los que subieron, del que más subió al que menos: para avisar qué precios revisar */
    aumentos: (datos?.insumos ?? [])
      .filter((insumo) => insumo.variacion !== null && insumo.variacion > 0)
      .sort((a, b) => (b.variacion ?? 0) - (a.variacion ?? 0)),
    /** El detalle del insumo, con todo su historial */
    abrir: (insumo: GastoInsumo) => router.push({ pathname: '/insumos/[id]', params: { id: insumo.insumoId } }),
    cargando: consulta.isLoading,
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !datos ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
