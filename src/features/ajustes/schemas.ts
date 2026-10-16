import { z } from 'zod';

/** GET y PATCH /api/ajustes: lo que el dueño elige desde la app y tiene que ver la web */
export const ajustesSchema = z.object({
  // z.string() y no un enum: si el back suma un estilo, la app no se rompe (usa el de por defecto)
  estiloCatalogo: z.string(),
});
