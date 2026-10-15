import type { z } from 'zod';
import type {
  loginSchema,
  recuperarRespuestaSchema,
  recuperarSchema,
  restablecerSchema,
  tokenRespuestaSchema,
} from './schemas';

export type TokenRespuesta = z.infer<typeof tokenRespuestaSchema>;
export type RecuperarRespuesta = z.infer<typeof recuperarRespuestaSchema>;

export type LoginDatos = z.infer<typeof loginSchema>;
export type RecuperarDatos = z.infer<typeof recuperarSchema>;
export type RestablecerFormulario = z.infer<typeof restablecerSchema>;

/** Lo que viaja a POST /auth/restablecer */
export interface RestablecerDatos {
  email: string;
  codigo: string;
  password: string;
}
