import { createAction } from '@reduxjs/toolkit';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { config } from '@/config';
import type { RootState } from '@/store';

/** Error de la API ya traducido a un mensaje para mostrar */
export interface ApiError {
  /** Código HTTP, o `null` si no hubo respuesta (sin conexión, timeout) o no tenía la forma esperada */
  status: number | null;
  mensaje: string;
}

/** El back rechazó el token guardado. La feature auth la escucha y cierra la sesión */
export const sesionVencida = createAction('api/sesionVencida');

const RESPUESTA_INESPERADA = 'El servidor respondió algo inesperado. Probá de nuevo más tarde.';

const fetchApi = fetchBaseQuery({
  baseUrl: `${config.apiUrl}/api`,
  timeout: config.apiTimeoutMs,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).sesion.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

function mensajeDelServidor(datos: unknown): string | undefined {
  if (typeof datos === 'object' && datos !== null && 'error' in datos && typeof datos.error === 'string') {
    return datos.error;
  }
  return undefined;
}

function errorHttp(status: number, datos?: unknown): ApiError {
  const mensaje =
    mensajeDelServidor(datos) ??
    (status === 429 ? 'Demasiados intentos. Probá de nuevo en un rato.' : 'Algo salió mal. Probá de nuevo.');
  return { status, mensaje };
}

function traducirError(error: FetchBaseQueryError): ApiError {
  switch (error.status) {
    case 'TIMEOUT_ERROR':
      return { status: null, mensaje: 'El servidor tardó demasiado en responder. Probá de nuevo.' };
    case 'FETCH_ERROR':
      // Puede ser falta de red o un pedido que fetch no pudo ni armar (ej.: un FormData mal formado).
      // En desarrollo se muestra la causa real: al usuario le llega igual que sin conexión
      if (__DEV__) console.warn('Pedido sin respuesta del servidor:', error.error);
      return { status: null, mensaje: 'No hay conexión con el servidor. Revisá tu internet y probá de nuevo.' };
    // La respuesta no era JSON: si además era un error HTTP (ej.: un 502 de Render), se trata como tal
    case 'PARSING_ERROR':
      return error.originalStatus >= 400 ? errorHttp(error.originalStatus) : { status: null, mensaje: RESPUESTA_INESPERADA };
    case 'CUSTOM_ERROR':
      return { status: null, mensaje: RESPUESTA_INESPERADA };
    default:
      return errorHttp(error.status, error.data);
  }
}

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError, object, FetchBaseQueryMeta> = async (
  args,
  api,
  opciones
) => {
  const resultado = await fetchApi(args, api, opciones);
  if (!resultado.error) return resultado;

  // Un 401 con token es un token vencido o inválido: se cierra la sesión
  if (resultado.error.status === 401 && resultado.meta?.request.headers.has('Authorization')) {
    api.dispatch(sesionVencida());
  }
  return { error: traducirError(resultado.error), meta: resultado.meta };
};

/** La única API de la app. Las features suman sus endpoints desde su <feature>Api.ts con `injectEndpoints` */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  // Cada endpoint valida la respuesta con su schema de Zod: si el back cambió la forma, falla acá y no en la pantalla
  catchSchemaFailure: () => ({ status: null, mensaje: RESPUESTA_INESPERADA }),
  endpoints: () => ({}),
});
