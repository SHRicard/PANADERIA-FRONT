import { z } from 'zod';

/** GET y PATCH /api/ajustes: lo que el dueño elige desde la app y tiene que ver la web */
export const ajustesSchema = z.object({
  // z.string() y no un enum: si el back suma un estilo, la app no se rompe (usa el de por defecto)
  estiloCatalogo: z.string(),
  // El negocio cerrado por un tiempo (feature `cierre`). Con default: un back de antes no los manda, y la web
  // queda abierta
  cerrado: z.boolean().default(false),
  mensajeCerrado: z.string().default(''),
  /**
   * La referencia de la agenda del dueño: cuántos productos por día puede preparar, más o menos (pinta los puntos de
   * colores). null = todavía no la puso. Solo informa: el día lo cierra el dueño con «Agenda llena». La web no la usa
   */
  productosPorDia: z.number().int().nullable().default(null),
  /**
   * El tema de la app del dueño, que también pinta la web para todos los clientes. Un back de antes no lo manda, o uno
   * nuevo podría sumar otro: claro
   */
  tema: z.enum(['claro', 'oscuro']).catch('claro'),
});
