import { z } from 'zod';

/** GET y PATCH /api/ajustes: lo que el dueño elige desde la app y tiene que ver la web */
export const ajustesSchema = z.object({
  // z.string() y no un enum: si el back suma un estilo, la app no se rompe (usa el de por defecto)
  estiloCatalogo: z.string(),
  // El negocio cerrado por un tiempo (feature `cierre`). Con default: un back de antes no los manda, y la web
  // queda abierta
  cerrado: z.boolean().default(false),
  mensajeCerrado: z.string().default(''),
});
