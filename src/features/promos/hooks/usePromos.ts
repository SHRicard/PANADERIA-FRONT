import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useListarPromosQuery } from '../api/promosApi';
import type { Promo } from '../types';

/** La biblioteca de promos (Más → Promos), la más nueva primero */
export function usePromos() {
  const router = useRouter();
  const consulta = useListarPromosQuery();

  return {
    promos: consulta.data ?? [],
    cargando: consulta.isLoading,
    error: consulta.isError && !consulta.data ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    nueva: () => router.push('/promos/nueva'),
    abrir: (promo: Promo) => router.push({ pathname: '/promos/[id]', params: { id: promo._id } }),
  };
}
