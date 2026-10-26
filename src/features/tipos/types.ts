import type { z } from 'zod';
import type { formularioTipoSchema, tipoSchema } from './schemas';

export type Tipo = z.infer<typeof tipoSchema>;
export type FormularioTipo = z.infer<typeof formularioTipoSchema>;
