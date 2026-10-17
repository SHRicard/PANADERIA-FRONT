import { productoSchema, type Producto } from '@/features/productos';
import { baseApi } from '@/services/api';
import { paginaCatalogoSchema, recomendacionCreadaSchema } from '../schemas';
import type { ConsultaCatalogo, NuevaRecomendacion, PaginaCatalogo, RecomendacionCreada } from '../types';

/** El máximo que acepta el back por página: la carta lo pide todo de una (y de ahí sale la anticipación del pedido) */
export const TODO_EL_CATALOGO = 100;

// El back guarda las últimas 50 de cada producto
const RECOMENDACIONES_MAX = 50;

// Todo público: el back no pide token
export const catalogoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Los productos activos, de a páginas. Cada combinación de filtros es una caché aparte */
    listarCatalogo: build.infiniteQuery<PaginaCatalogo, ConsultaCatalogo, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      // Los filtros en undefined no viajan
      query: ({ queryArg, pageParam }) => ({
        url: '/catalogo',
        params: { ...queryArg, pagina: pageParam },
      }),
      rawResponseSchema: paginaCatalogoSchema,
    }),

    /** Un producto activo con todas sus fotos. 404 si está pausado o no existe */
    obtenerDelCatalogo: build.query<Producto, string>({
      query: (id) => `/catalogo/${id}`,
      rawResponseSchema: productoSchema,
    }),

    /** Deja una recomendación, sin login. 404 si el producto se pausó; 429 después de 10 en una hora */
    recomendar: build.mutation<RecomendacionCreada, { productoId: string; datos: NuevaRecomendacion }>({
      query: ({ productoId, datos }) => ({ url: `/catalogo/${productoId}/recomendaciones`, method: 'POST', body: datos }),
      rawResponseSchema: recomendacionCreadaSchema,
      // Se suma al detalle en la caché, sin recargarlo: el promedio ya viene calculado
      async onQueryStarted({ productoId }, { dispatch, queryFulfilled }) {
        let creada: RecomendacionCreada;
        try {
          ({ data: creada } = await queryFulfilled);
        } catch {
          return; // El error lo muestra la pantalla, que espera la mutación
        }
        const { recomendacion, puntajePromedio, cantidadRecomendaciones } = creada;
        dispatch(
          catalogoApi.util.updateQueryData('obtenerDelCatalogo', productoId, (producto) => {
            producto.recomendaciones = [recomendacion, ...(producto.recomendaciones ?? [])].slice(0, RECOMENDACIONES_MAX);
            producto.puntajePromedio = puntajePromedio;
            producto.cantidadRecomendaciones = cantidadRecomendaciones;
          }),
        );
      },
    }),
  }),
});

export const { useListarCatalogoInfiniteQuery, useObtenerDelCatalogoQuery, useRecomendarMutation } = catalogoApi;
