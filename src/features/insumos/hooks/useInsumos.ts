import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useListarInsumosQuery } from '../api/insumosApi';
import type { Insumo } from '../types';

/** La lista de insumos (Más → Insumos) */
export function useInsumos() {
  const router = useRouter();
  const consulta = useListarInsumosQuery();

  return {
    insumos: consulta.data ?? [],
    cargando: consulta.isLoading,
    error: consulta.isError && !consulta.data ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    nuevo: () => router.push('/insumos/nuevo'),
    abrir: (insumo: Insumo) => router.push({ pathname: '/insumos/[id]', params: { id: insumo._id } }),
  };
}
