import { useMemo } from 'react';
import { TODO_EL_CATALOGO, useListarCatalogoInfiniteQuery } from '../api/catalogoApi';

export interface Anticipacion {
  horas: number;
  nombre: string;
}

/**
 * Con cuántas horas se encarga cada producto activo, por id (el carrito solo guarda ids). Trae todo el catálogo de
 * una, sin filtros: la carta llega por secciones, así que esta consulta se pide aparte la primera vez
 */
export function useAnticipaciones() {
  const consulta = useListarCatalogoInfiniteQuery({ limite: TODO_EL_CATALOGO });
  const paginas = consulta.data?.pages;
  const porId = useMemo(
    () =>
      new Map<string, Anticipacion>(
        paginas?.flatMap(({ productos }) =>
          productos.map((producto) => [producto._id, { horas: producto.anticipacionHoras, nombre: producto.nombre }] as const),
        ),
      ),
    [paginas],
  );

  return {
    /** undefined si no lo encontró (todavía carga, o ya no está activo) */
    anticipacionDe: (productoId: string): Anticipacion | undefined => porId.get(productoId),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
