import { useRouter } from 'expo-router';

/** El menú de Métricas: a dónde lleva cada fila */
export function useMetricas() {
  const router = useRouter();

  return {
    abrirBalance: () => router.push('/metricas/balance'),
    abrirProductos: () => router.push('/metricas/productos'),
    abrirGustos: () => router.push('/metricas/gustos'),
    abrirPedidos: () => router.push('/metricas/pedidos'),
    abrirClientes: () => router.push('/metricas/clientes'),
    abrirInsumos: () => router.push('/metricas/insumos'),
  };
}
