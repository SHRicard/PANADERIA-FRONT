import { current } from '@reduxjs/toolkit';
import { File } from 'expo-file-system';
import { baseApi } from '@/services/api';
import type { AppDispatch, RootState } from '@/store';
import { categoriasSchema, imagenSchema, paginaProductosSchema, productoSchema } from '../schemas';
import type {
  CambiosProducto,
  Categoria,
  DatosProducto,
  FiltrosProductos,
  FotoLocal,
  Imagen,
  PaginaProductos,
  Producto,
} from '../types';

// Una foto con mala señal tarda más que un pedido común (60 s)
const TIMEOUT_FOTO_MS = 120_000;
/** Productos por página. El back acepta hasta 100 */
const POR_PAGINA = 20;
/** Las listas (con cualquier filtro). Cada detalle tiene su propio tag: { type: 'Producto', id } */
const LISTA = { type: 'Producto', id: 'LISTA' } as const;

export const productosApi = baseApi.enhanceEndpoints({ addTagTypes: ['Producto'] }).injectEndpoints({
  endpoints: (build) => ({
    /**
     * La lista del admin, de a páginas, también los pausados, con sus fotos.
     * Cada combinación de filtros es una caché aparte: volver a un filtro ya visto es instantáneo
     */
    listarProductos: build.infiniteQuery<PaginaProductos, FiltrosProductos, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      // Los filtros en undefined no viajan
      query: ({ queryArg, pageParam }) => ({
        url: '/productos',
        params: { ...queryArg, pagina: pageParam, limite: POR_PAGINA },
      }),
      rawResponseSchema: paginaProductosSchema,
      providesTags: [LISTA],
    }),

    /** Un producto, aunque esté pausado. Lo usan el detalle y la edición */
    obtenerProducto: build.query<Producto, string>({
      query: (id) => `/productos/${id}`,
      rawResponseSchema: productoSchema,
      providesTags: (_resultado, _error, id) => [{ type: 'Producto', id }],
    }),

    /** Los gustos (las categorías fijas del back), en orden. Solo cambian con un deploy del back: se piden una vez */
    listarCategorias: build.query<Categoria[], void>({
      query: () => '/catalogo/categorias',
      rawResponseSchema: categoriasSchema,
      keepUnusedDataFor: 60 * 60,
    }),

    /** Crea el producto SOLO con los datos: responde enseguida. Las fotos van después, por la cola */
    crearProducto: build.mutation<Producto, DatosProducto>({
      query: (datos) => ({ url: '/productos', method: 'POST', body: datos }),
      rawResponseSchema: productoSchema,
      // Recarga las listas: el nuevo aparece en su lugar (por gusto y nombre)
      invalidatesTags: [LISTA],
    }),

    /** Manda solo lo que cambió. Lo que no viene, el back no lo toca; un opcional en null lo borra */
    editarProducto: build.mutation<Producto, { id: string; datos: CambiosProducto }>({
      query: ({ id, datos }) => ({ url: `/productos/${id}`, method: 'PUT', body: datos }),
      rawResponseSchema: productoSchema,
      // Se reemplaza en las cachés en vez de recargar: así no pisa las fotos que se están subiendo.
      // Si cambió el estado o el gusto, queda donde estaba en la lista hasta que se refresque: no salta
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        let editado: Producto;
        try {
          ({ data: editado } = await queryFulfilled);
        } catch {
          return; // El error lo muestra la pantalla, que espera la mutación
        }
        // Las fotos se quedan como están en la caché: la cola puede haber sumado alguna mientras tanto
        dispatch(cambiarProductoEnCache(id, (producto) => ({ ...editado, imagenes: producto.imagenes })));
      },
    }),

    /** Pasa esa foto al primer lugar. Se puede usar mientras la cola sube otras: el back no pisa ninguna */
    cambiarPortada: build.mutation<Producto, { productoId: string; imagenId: string }>({
      query: ({ productoId, imagenId }) => ({ url: `/productos/${productoId}/portada`, method: 'PUT', body: { imagenId } }),
      rawResponseSchema: productoSchema,
      async onQueryStarted({ productoId }, { dispatch, queryFulfilled }) {
        let actualizado: Producto;
        try {
          ({ data: actualizado } = await queryFulfilled);
        } catch {
          return; // El error lo muestra la pantalla, que espera la mutación
        }
        // El orden lo manda el back. Si la cola sumó una foto que el back todavía no tenía, queda al final
        const delBack = new Set(actualizado.imagenes.map(({ id }) => id));
        dispatch(
          cambiarProductoEnCache(productoId, (producto) => ({
            ...producto,
            imagenes: [...actualizado.imagenes, ...producto.imagenes.filter(({ id }) => !delBack.has(id))],
          }))
        );
      },
    }),

    /** Borra el producto y, en el back, también todas sus fotos de Cloudinary */
    borrarProducto: build.mutation<void, string>({
      query: (id) => ({ url: `/productos/${id}`, method: 'DELETE' }),
      // Recarga las listas, pero NO el detalle: así no muestra "ya no existe" en el momento en que vuelve
      invalidatesTags: [LISTA],
    }),

    /** Una foto por request. La usa la cola de subidas, no las pantallas */
    subirFoto: build.mutation<Imagen, { productoId: string; foto: FotoLocal }>({
      query: ({ productoId, foto }) => {
        const formulario = new FormData();
        // Expo reemplaza el fetch de React Native por expo/fetch, que NO acepta el { uri, name, type } clásico:
        // falla antes de mandar nada y se ve como "sin conexión". Hay que pasarle un File de expo-file-system,
        // que trae el nombre y el tipo (image/jpeg) del archivo. Sin Content-Type a mano: fetch arma el multipart solo
        formulario.append('imagen', new File(foto.uri));
        return { url: `/productos/${productoId}/imagenes`, method: 'POST', body: formulario, timeout: TIMEOUT_FOTO_MS };
      },
      rawResponseSchema: imagenSchema,
    }),

    /** Borra una foto (del producto y de Cloudinary). Si era la portada, la siguiente pasa a serlo */
    borrarFoto: build.mutation<void, { productoId: string; imagenId: string }>({
      query: ({ productoId, imagenId }) => ({ url: `/productos/${productoId}/imagenes/${imagenId}`, method: 'DELETE' }),
      async onQueryStarted({ productoId, imagenId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          return;
        }
        dispatch(
          cambiarProductoEnCache(productoId, (producto) => ({
            ...producto,
            imagenes: producto.imagenes.filter((imagen) => imagen.id !== imagenId),
          }))
        );
      },
    }),
  }),
});

/**
 * Cambia un producto en todas las cachés donde esté: su detalle y cada lista cargada, con cualquier filtro.
 * `cambiar` recibe el producto como está y devuelve cómo queda
 */
export function cambiarProductoEnCache(id: string, cambiar: (producto: Producto) => Producto) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(productosApi.util.updateQueryData('obtenerProducto', id, (producto) => cambiar(current(producto))));
    for (const filtros of productosApi.util.selectCachedArgsForQuery(getState(), 'listarProductos')) {
      dispatch(
        productosApi.util.updateQueryData('listarProductos', filtros, ({ pages }) => {
          for (const pagina of pages) {
            const indice = pagina.productos.findIndex(({ _id }) => _id === id);
            if (indice !== -1) pagina.productos[indice] = cambiar(current(pagina.productos[indice]));
          }
        })
      );
    }
  };
}

export const {
  useListarProductosInfiniteQuery,
  useObtenerProductoQuery,
  useListarCategoriasQuery,
  useCrearProductoMutation,
  useEditarProductoMutation,
  useBorrarProductoMutation,
  useBorrarFotoMutation,
  useCambiarPortadaMutation,
} = productosApi;
