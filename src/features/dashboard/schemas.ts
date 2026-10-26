import { z } from 'zod';
import { pedidoSchema } from '@/features/pedidos';

/** GET /api/resumen: lo de hoy para el inicio. Hoy es el día de Argentina, el mismo que usan las métricas */
export const resumenSchema = z.object({
  /** AAAA-MM-DD */
  fecha: z.string(),
  hoy: z.object({
    /** Los pedidos hechos hoy que no se cancelaron */
    pedidos: z.number().int(),
    /** La suma de sus totales: lo mismo que los ingresos del balance de hoy */
    vendido: z.number(),
  }),
  /** Los que siguen abiertos, de cualquier día: lo que el dueño tiene para atender */
  abiertos: z.object({
    /** Esperando la seña */
    pendiente: z.number().int(),
    /** Con la seña pagada, para preparar y entregar */
    confirmado: z.number().int(),
  }),
  /** Los pedidos de hoy (sin los cancelados), del más nuevo al más viejo. Hasta 10: el resto, en la pestaña Pedidos */
  ultimosPedidos: z.array(pedidoSchema),
});
