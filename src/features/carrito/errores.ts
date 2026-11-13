import { mensajeDeError, type ApiError } from '@/services/api';

/** Lo que ve el cliente cuando el back se cae (500 o más): el texto crudo («Error interno») no le dice nada */
export const MENSAJE_PROBLEMA_SERVIDOR = 'Tuvimos un problema de nuestro lado. Probá de nuevo en un rato.';

/**
 * El mensaje de un error para la web pública. Los errores del back con sentido para el cliente (un 400, un 409 de día
 * lleno, un 429) llegan tal cual; los del servidor caído, con un mensaje amable
 */
export function mensajeParaCliente(error: unknown): string {
  const status = (error as Partial<ApiError> | null)?.status;
  if (typeof status === 'number' && status >= 500) return MENSAJE_PROBLEMA_SERVIDOR;
  return mensajeDeError(error);
}
