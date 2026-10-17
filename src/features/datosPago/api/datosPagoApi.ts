import { baseApi } from '@/services/api';
import { datosPagoSchema } from '../schemas';
import type { DatosPago } from '../types';

export const datosPagoApi = baseApi.enhanceEndpoints({ addTagTypes: ['DatosPago'] }).injectEndpoints({
  endpoints: (build) => ({
    /**
     * Público: la web se los muestra al cliente después del pedido, y la app del dueño los edita.
     * Si el dueño todavía no los cargó, el back responde 404: es "no hay datos", no una falla
     */
    obtenerDatosPago: build.query<DatosPago, void>({
      query: () => '/datos-pago',
      rawResponseSchema: datosPagoSchema,
      providesTags: ['DatosPago'],
    }),

    /** Con token. Carga o reemplaza los cuatro datos */
    guardarDatosPago: build.mutation<DatosPago, DatosPago>({
      query: (datos) => ({ url: '/datos-pago', method: 'PUT', body: datos }),
      rawResponseSchema: datosPagoSchema,
      async onQueryStarted(_datos, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(datosPagoApi.util.upsertQueryData('obtenerDatosPago', undefined, data));
        } catch {
          // El error lo muestra el formulario
        }
      },
    }),

    /** Con token. La web deja de mostrarlos */
    borrarDatosPago: build.mutation<void, void>({
      query: () => ({ url: '/datos-pago', method: 'DELETE' }),
      invalidatesTags: ['DatosPago'],
    }),
  }),
});

export const { useObtenerDatosPagoQuery, useGuardarDatosPagoMutation, useBorrarDatosPagoMutation } = datosPagoApi;
