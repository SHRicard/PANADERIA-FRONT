import { useRouter } from 'expo-router';
import type { Pedido } from '@/features/pedidos';
import { mensajeDeError } from '@/services/api';
import { useResumenDelDiaQuery } from '../api/dashboardApi';

/** Lo de hoy para el inicio: los pedidos nuevos, lo vendido y los que siguen abiertos */
export function useResumen() {
  const router = useRouter();
  const consulta = useResumenDelDiaQuery();
  const resumen = consulta.data;

  return {
    resumen,
    cargando: consulta.isLoading,
    error: consulta.isError && !resumen ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    /** Hoy hubo más pedidos de los que trae la lista (hasta 10): el resto está en la pestaña Pedidos */
    hayMasPedidos: resumen ? resumen.hoy.pedidos > resumen.ultimosPedidos.length : false,
    abrir: (pedido: Pedido) => router.push({ pathname: '/pedidos/[id]', params: { id: pedido._id } }),
    verPedidos: () => router.navigate('/pedidos'),
  };
}
