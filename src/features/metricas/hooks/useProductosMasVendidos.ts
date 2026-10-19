import { mensajeDeError } from '@/services/api';
import { useProductosMasVendidosQuery } from '../api/metricasApi';
import { rangoDe, type Periodo } from '../rangos';
import type { OrdenProductos, ProductoVendido } from '../types';

/** Los más vendidos del período: por defecto, el top 5 por unidades */
export function useProductosMasVendidos(periodo: Periodo, orden: OrdenProductos = 'unidades', limite = 5) {
  const consulta = useProductosMasVendidosQuery({ ...rangoDe(periodo), orden, limite });
  // Si falla al cambiar de período, data todavía es la del anterior: no se muestra con el nombre del nuevo
  const datos = consulta.isError ? consulta.currentData : consulta.data;
  const total = orden === 'unidades' ? (datos?.totalUnidades ?? 0) : (datos?.totalImporte ?? 0);

  return {
    productos: datos?.productos ?? [],
    totalPedidos: datos?.totalPedidos ?? 0,
    totalUnidades: datos?.totalUnidades ?? 0,
    totalImporte: datos?.totalImporte ?? 0,
    /** Cuántos productos distintos se vendieron (puede haber más que los que trae la página) */
    totalProductos: datos?.totalProductos ?? 0,
    /** Qué parte del total del período es este producto, de 0 a 100, según el orden elegido */
    porcentaje: (producto: ProductoVendido) =>
      total > 0 ? Math.round(((orden === 'unidades' ? producto.unidades : producto.importe) / total) * 100) : 0,
    cargando: consulta.isLoading,
    /** Cambió el período o el orden y está trayendo los nuevos (se siguen viendo los anteriores) */
    actualizando: consulta.isFetching && !consulta.isLoading,
    error: consulta.isError && !datos ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
