import { z } from 'zod';
import { MAX_MENSAJE_CERRADO } from './textos';

/** El mensaje del cartel de cerrado (Preferencias → Web): lo que el dueño les dice a los clientes */
export const formularioCierreSchema = z.object({
  mensaje: z.string().trim().max(MAX_MENSAJE_CERRADO, `Puede tener hasta ${MAX_MENSAJE_CERRADO} letras`),
});
