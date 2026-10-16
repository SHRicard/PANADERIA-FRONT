import { baseApi } from '@/services/api';
import { ajustesSchema } from '../schemas';
import type { Ajustes, CambiosAjustes } from '../types';

export const ajustesApi = baseApi.enhanceEndpoints({ addTagTypes: ['Ajustes'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Público: lo lee la web para saber cómo mostrarse, y la app del dueño para mostrar qué eligió */
    obtenerAjustes: build.query<Ajustes, void>({
      query: () => '/ajustes',
      rawResponseSchema: ajustesSchema,
      providesTags: ['Ajustes'],
    }),

    /** Con token. El cambio se ve en el momento; si el back lo rechaza, vuelve a lo que había */
    cambiarAjustes: build.mutation<Ajustes, CambiosAjustes>({
      query: (cambios) => ({ url: '/ajustes', method: 'PATCH', body: cambios }),
      rawResponseSchema: ajustesSchema,
      async onQueryStarted(cambios, { dispatch, queryFulfilled }): Promise<void> {
        const parche = dispatch(
          ajustesApi.util.updateQueryData('obtenerAjustes', undefined, (ajustes) => {
            Object.assign(ajustes, cambios);
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(ajustesApi.util.upsertQueryData('obtenerAjustes', undefined, data));
        } catch {
          parche.undo();
        }
      },
    }),
  }),
});

export const { useObtenerAjustesQuery, useCambiarAjustesMutation } = ajustesApi;
