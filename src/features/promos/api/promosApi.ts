import { File } from 'expo-file-system';
import { baseApi } from '@/services/api';
import type { AppDispatch } from '@/store';
import { promoSchema, promosSchema } from '../schemas';
import type { CambiosPromo, DatosPromo, Promo } from '../types';

// Un video de 50 MB con mala señal, más lo que tarda Cloudinary en procesarlo, pasa el minuto de un pedido común
const TIMEOUT_SUBIDA_MS = 180_000;
const LISTA = { type: 'Promo', id: 'LISTA' } as const;

export const promosApi = baseApi.enhanceEndpoints({ addTagTypes: ['Promo'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Toda la biblioteca, la más nueva primero (el back no la pagina) */
    listarPromos: build.query<Promo[], void>({
      query: () => '/promos',
      rawResponseSchema: promosSchema,
      providesTags: [LISTA],
    }),

    /** Sube la foto o el video con su título y texto. Tarda: el archivo pasa por el back y por Cloudinary */
    crearPromo: build.mutation<Promo, DatosPromo>({
      query: ({ titulo, texto, archivo }) => {
        const formulario = new FormData();
        formulario.append('titulo', titulo);
        if (texto) formulario.append('texto', texto);
        // Como en las fotos de productos: expo/fetch necesita un File de expo-file-system. Trae el tipo (image/jpeg o
        // video/mp4), que es lo que el back usa para saber si es una foto o un video. Sin Content-Type a mano
        formulario.append('archivo', new File(archivo.uri));
        return { url: '/promos', method: 'POST', body: formulario, timeout: TIMEOUT_SUBIDA_MS };
      },
      rawResponseSchema: promoSchema,
      invalidatesTags: [LISTA],
    }),

    /** Título y texto, sin volver a subir el archivo */
    editarPromo: build.mutation<Promo, { id: string; cambios: CambiosPromo }>({
      query: ({ id, cambios }) => ({ url: `/promos/${id}`, method: 'PATCH', body: cambios }),
      rawResponseSchema: promoSchema,
      async onQueryStarted(_args, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(reemplazarEnLista(data));
        } catch {
          // El error lo muestra el formulario
        }
      },
    }),

    /** El dueño tocó Compartir: el back suma uno a vecesPublicada y guarda la fecha */
    registrarPublicacion: build.mutation<Promo, string>({
      query: (id) => ({ url: `/promos/${id}/publicaciones`, method: 'POST' }),
      rawResponseSchema: promoSchema,
      async onQueryStarted(_id, { dispatch, queryFulfilled }): Promise<void> {
        try {
          const { data } = await queryFulfilled;
          dispatch(reemplazarEnLista(data));
        } catch {
          // Si falla, la promo igual se compartió: solo queda sin contar
        }
      },
    }),

    /** Borra la promo y, en el back, su archivo de Cloudinary */
    borrarPromo: build.mutation<void, string>({
      query: (id) => ({ url: `/promos/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }): Promise<void> {
        try {
          await queryFulfilled;
          dispatch(promosApi.util.updateQueryData('listarPromos', undefined, (lista) => lista.filter((p) => p._id !== id)));
        } catch {
          // El error lo muestra la pantalla
        }
      },
    }),
  }),
});

/** Cambia la promo en la lista cargada, sin volver a pedirla */
function reemplazarEnLista(promo: Promo) {
  return (dispatch: AppDispatch) => {
    dispatch(
      promosApi.util.updateQueryData('listarPromos', undefined, (lista) => {
        const indice = lista.findIndex(({ _id }) => _id === promo._id);
        if (indice !== -1) lista[indice] = promo;
      })
    );
  };
}

export const {
  useListarPromosQuery,
  useCrearPromoMutation,
  useEditarPromoMutation,
  useRegistrarPublicacionMutation,
  useBorrarPromoMutation,
} = promosApi;
