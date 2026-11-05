import { cambiarProductoEnCache } from '@/features/productos';
import { baseApi, type ApiError } from '@/services/api';
import { produccionSchema, recetaSchema } from '../schemas';
import type { DatosReceta, Produccion, Receta } from '../types';

/** Cada receta tiene su tag: { type: 'Receta', id: productoId }. Insumos invalida 'Receta' entero (cambia el costo) */
export const recetasApi = baseApi.enhanceEndpoints({ addTagTypes: ['Receta'] }).injectEndpoints({
  endpoints: (build) => ({
    /** La receta de un producto. 404 = todavía no tiene (no es una falla) */
    obtenerReceta: build.query<Receta, string>({
      query: (productoId) => `/recetas/${productoId}`,
      rawResponseSchema: recetaSchema,
      providesTags: (_resultado, _error, productoId) => [{ type: 'Receta', id: productoId }],
    }),

    /**
     * Cuánto hace falta de cada ingrediente para hacer `unidades`, con lo que cuesta. Solo calcula: no guarda nada.
     * Con el tag de la receta: cargar una compra de insumo o editar el producto lo recalcula
     */
    calcularProduccion: build.query<Produccion, { productoId: string; unidades: number }>({
      query: ({ productoId, unidades }) => ({ url: `/recetas/${productoId}/produccion`, params: { unidades } }),
      rawResponseSchema: produccionSchema,
      providesTags: (_resultado, _error, { productoId }) => [{ type: 'Receta', id: productoId }],
    }),

    /** La crea o la reemplaza entera. Responde la receta con los costos: se guarda en la caché, sin otro pedido */
    guardarReceta: build.mutation<Receta, { productoId: string; datos: DatosReceta }>({
      query: ({ productoId, datos }) => ({ url: `/recetas/${productoId}`, method: 'PUT', body: datos }),
      rawResponseSchema: recetaSchema,
      async onQueryStarted({ productoId }, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(recetasApi.util.upsertQueryData('obtenerReceta', productoId, data));
        } catch {
          // El error lo muestra el formulario
        }
      },
    }),

    /**
     * Le pone al producto el precio de venta que sale de la receta: lo que cuesta hoy cada unidad × multiplicador,
     * redondeado al peso o, con `redondeo`, al múltiplo de arriba. Responde la receta con el precio nuevo, el
     * multiplicador y el redondeo, que quedan para la próxima vez
     */
    ponerPrecioReceta: build.mutation<Receta, { productoId: string; multiplicador: number; redondeo: number | null }>({
      query: ({ productoId, multiplicador, redondeo }) => ({
        url: `/recetas/${productoId}/precio`,
        method: 'PUT',
        body: { multiplicador, redondeo },
      }),
      rawResponseSchema: recetaSchema,
      async onQueryStarted({ productoId }, { dispatch, queryFulfilled }): Promise<void> {
        let receta: Receta;
        try {
          ({ data: receta } = await queryFulfilled);
        } catch {
          return; // El error lo muestra la pantalla
        }
        dispatch(recetasApi.util.upsertQueryData('obtenerReceta', productoId, receta));
        // El precio nuevo, en el detalle y en las listas de productos, sin recargarlos: así no pisa las fotos que se
        // estén subiendo (como editarProducto)
        dispatch(cambiarProductoEnCache(productoId, (producto) => ({ ...producto, precio: receta.producto.precio })));
      },
    }),

    /** Se vuelve a pedir: responde 404 y el detalle del producto vuelve a ofrecer «Agregar receta» */
    borrarReceta: build.mutation<void, string>({
      query: (productoId) => ({ url: `/recetas/${productoId}`, method: 'DELETE' }),
      invalidatesTags: (_resultado, _error, productoId) => [{ type: 'Receta', id: productoId }],
    }),
  }),
});

/** El 404 de GET /api/recetas/:productoId: el producto todavía no tiene receta. No es una falla */
export const esSinReceta = (error: unknown) => (error as Partial<ApiError> | undefined)?.status === 404;

export const {
  useObtenerRecetaQuery,
  useCalcularProduccionQuery,
  useGuardarRecetaMutation,
  usePonerPrecioRecetaMutation,
  useBorrarRecetaMutation,
} = recetasApi;
