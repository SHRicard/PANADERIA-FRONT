import { useMemo } from 'react';
import { useListarCategoriasQuery } from '../api/productosApi';

/** Los gustos (las categorías fijas del back: Dulce, Salado…), en orden. Vacío mientras cargan */
export function useCategorias(): string[] {
  const { data } = useListarCategoriasQuery();
  return useMemo(() => data?.map(({ nombre }) => nombre) ?? [], [data]);
}
