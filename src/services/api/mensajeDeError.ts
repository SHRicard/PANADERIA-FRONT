import type { ApiError } from './baseApi';

function esApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'mensaje' in error && typeof error.mensaje === 'string';
}

/** El texto para mostrarle al usuario cuando algo falla */
export function mensajeDeError(error: unknown): string {
  return esApiError(error) ? error.mensaje : 'Algo salió mal. Probá de nuevo.';
}
