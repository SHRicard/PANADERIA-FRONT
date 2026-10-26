import { useListarTiposQuery, type Tipo } from '@/features/tipos';

/**
 * Los tipos que arma el dueño en Más → Tipos (Tortas, Tartas…), por nombre. null mientras cargan; si no se pudieron
 * traer, vacío: el tipo es opcional y el producto se guarda igual
 */
export function useTiposDeProducto(): Tipo[] | null {
  const { data, isError } = useListarTiposQuery();
  return data ?? (isError ? [] : null);
}
