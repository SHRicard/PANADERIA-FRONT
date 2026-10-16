import type { z } from 'zod';
import type { ajustesSchema } from './schemas';

export type Ajustes = z.infer<typeof ajustesSchema>;
/** PATCH /api/ajustes: solo cambia lo que viene */
export type CambiosAjustes = Partial<Ajustes>;
