import { baseApi } from '@/services/api';
import { recuperarRespuestaSchema, tokenRespuestaSchema } from '../schemas';
import type { LoginDatos, RecuperarRespuesta, RestablecerDatos, TokenRespuesta } from '../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Devuelve el token de sesión. El slice `sesion` lo guarda solo */
    login: build.mutation<string, LoginDatos>({
      query: (datos) => ({ url: '/auth/login', method: 'POST', body: datos }),
      rawResponseSchema: tokenRespuestaSchema,
      transformResponse: (respuesta: TokenRespuesta) => respuesta.token,
    }),

    /** Pide que manden el código al email. El back responde lo mismo exista o no el email */
    pedirCodigo: build.mutation<string, string>({
      query: (email) => ({ url: '/auth/recuperar', method: 'POST', body: { email } }),
      rawResponseSchema: recuperarRespuestaSchema,
      transformResponse: (respuesta: RecuperarRespuesta) => respuesta.mensaje,
    }),

    /** Cambia la contraseña con el código y devuelve un token, así la app entra directo */
    restablecer: build.mutation<string, RestablecerDatos>({
      query: (datos) => ({ url: '/auth/restablecer', method: 'POST', body: datos }),
      rawResponseSchema: tokenRespuestaSchema,
      transformResponse: (respuesta: TokenRespuesta) => respuesta.token,
    }),
  }),
});

export const { useLoginMutation, usePedirCodigoMutation, useRestablecerMutation } = authApi;
