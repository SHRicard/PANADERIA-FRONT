import { baseApi } from '@/services/api';
import { tipoSchema, tiposSchema } from '../schemas';
import type { Tipo } from '../types';

/** La lista de tipos */
const LISTA = { type: 'Tipo', id: 'LISTA' } as const;

// Renombrar o borrar un tipo cambia lo que muestran los productos: esas dos invalidan también 'Producto'
export const tiposApi = baseApi.enhanceEndpoints({ addTagTypes: ['Tipo', 'Producto'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Todos, por nombre, con cuántos productos usa cada uno. Lo usan Más → Tipos y el formulario del producto */
    listarTipos: build.query<Tipo[], void>({
      query: () => '/tipos',
      rawResponseSchema: tiposSchema,
      providesTags: [LISTA],
    }),

    crearTipo: build.mutation<Tipo, string>({
      query: (nombre) => ({ url: '/tipos', method: 'POST', body: { nombre } }),
      rawResponseSchema: tipoSchema,
      invalidatesTags: [LISTA],
    }),

    /** Los productos guardan el id: el nombre nuevo sale en todos. Se recargan los productos para mostrarlo */
    renombrarTipo: build.mutation<Tipo, { id: string; nombre: string }>({
      query: ({ id, nombre }) => ({ url: `/tipos/${id}`, method: 'PUT', body: { nombre } }),
      rawResponseSchema: tipoSchema,
      invalidatesTags: [LISTA, 'Producto'],
    }),

    /** Los productos que lo usaban quedan sin tipo (no se borra ninguno): se recargan */
    borrarTipo: build.mutation<void, string>({
      query: (id) => ({ url: `/tipos/${id}`, method: 'DELETE' }),
      invalidatesTags: [LISTA, 'Producto'],
    }),
  }),
});

export const { useListarTiposQuery, useCrearTipoMutation, useRenombrarTipoMutation, useBorrarTipoMutation } = tiposApi;
