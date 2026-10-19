import { baseApi } from '@/services/api';
import { paginaArchivosSchema, usoCloudinarySchema } from '../schemas';
import type { OrigenArchivo, PaginaArchivos, UsoCloudinary } from '../types';

/** Archivos por página. El back acepta hasta 100 */
const POR_PAGINA = 20;

export const almacenamientoApi = baseApi.enhanceEndpoints({ addTagTypes: ['ArchivoAlmacenado'] }).injectEndpoints({
  endpoints: (build) => ({
    /**
     * Con token. Sin tag: borrar no lo cambia al instante (Cloudinary recalcula cada tanto y el back guarda la
     * respuesta 10 minutos), así que no hay nada que invalidar
     */
    obtenerAlmacenamiento: build.query<UsoCloudinary, void>({
      query: () => '/almacenamiento',
      rawResponseSchema: usoCloudinarySchema,
    }),

    /**
     * Con token. Las fotos de productos y las promos, lo que más ocupa primero, de a páginas.
     * Sin origen, todo. Se borran con los endpoints de siempre (ver useArchivos)
     */
    listarArchivos: build.infiniteQuery<PaginaArchivos, OrigenArchivo | undefined, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      // El origen en undefined no viaja
      query: ({ queryArg, pageParam }) => ({
        url: '/almacenamiento/archivos',
        params: { origen: queryArg, pagina: pageParam, limite: POR_PAGINA },
      }),
      rawResponseSchema: paginaArchivosSchema,
      providesTags: ['ArchivoAlmacenado'],
    }),
  }),
});

export const { useObtenerAlmacenamientoQuery, useListarArchivosInfiniteQuery } = almacenamientoApi;
