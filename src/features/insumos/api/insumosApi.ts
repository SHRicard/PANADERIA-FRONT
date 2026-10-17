import { baseApi } from '@/services/api';
import { insumoConHistorialSchema, insumosSchema } from '../schemas';
import type { DatosInsumo, Insumo, InsumoConHistorial } from '../types';

/** La lista. Cada detalle tiene su propio tag: { type: 'Insumo', id } */
const LISTA = { type: 'Insumo', id: 'LISTA' } as const;

export const insumosApi = baseApi.enhanceEndpoints({ addTagTypes: ['Insumo'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Todos, por nombre, sin el historial */
    listarInsumos: build.query<Insumo[], void>({
      query: () => '/insumos',
      rawResponseSchema: insumosSchema,
      providesTags: [LISTA],
    }),

    /** Uno con su historial, la entrada más nueva primero */
    obtenerInsumo: build.query<InsumoConHistorial, string>({
      query: (id) => `/insumos/${id}`,
      rawResponseSchema: insumoConHistorialSchema,
      providesTags: (_resultado, _error, id) => [{ type: 'Insumo', id }],
    }),

    /** El alta. Responde el insumo con su historial: se guarda en la caché del detalle para abrirlo sin otro pedido */
    crearInsumo: build.mutation<InsumoConHistorial, DatosInsumo>({
      query: (datos) => ({ url: '/insumos', method: 'POST', body: datos }),
      rawResponseSchema: insumoConHistorialSchema,
      invalidatesTags: [LISTA],
      async onQueryStarted(_datos, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(insumosApi.util.upsertQueryData('obtenerInsumo', data._id, data));
        } catch {
          // El error lo muestra el formulario
        }
      },
    }),

    /** Una compra nueva o una corrección: solo lo que cambia. El back suma la entrada al historial */
    actualizarInsumo: build.mutation<InsumoConHistorial, { id: string; cambios: Partial<DatosInsumo> }>({
      query: ({ id, cambios }) => ({ url: `/insumos/${id}`, method: 'PUT', body: cambios }),
      rawResponseSchema: insumoConHistorialSchema,
      invalidatesTags: [LISTA],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(insumosApi.util.upsertQueryData('obtenerInsumo', id, data));
        } catch {
          // El error lo muestra el formulario
        }
      },
    }),
  }),
});

export const { useListarInsumosQuery, useObtenerInsumoQuery, useCrearInsumoMutation, useActualizarInsumoMutation } =
  insumosApi;
