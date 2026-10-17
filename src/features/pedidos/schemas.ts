import { z } from 'zod';

export const ESTADOS_PEDIDO = ['pendiente', 'confirmado', 'entregado', 'cancelado'] as const;

/** Un producto del pedido. Nombre, precio y gusto son los del momento en que lo pidió */
export const itemPedidoSchema = z.object({
  producto: z.string(),
  nombre: z.string(),
  precio: z.number(),
  categoria: z.string(),
  cantidad: z.number().int(),
});

/** La seña que confirmó el dueño */
export const senaSchema = z.object({
  monto: z.number().positive(),
  /** Cuándo la confirmó. Si después corrige el monto, no cambia */
  pagadaEn: z.string(),
});

/** Cada pedido de GET /api/pedidos */
export const pedidoSchema = z.object({
  _id: z.string(),
  /** El id del cliente. En el detalle viene con sus datos (detallePedidoSchema) */
  cliente: z.string(),
  /** Nombre y teléfono como los dejó al pedir */
  clienteNombre: z.string(),
  clienteTelefono: z.string(),
  items: z.array(itemPedidoSchema),
  total: z.number(),
  /** pendiente: esperando la seña · confirmado: la seña está pagada · entregado · cancelado */
  estado: z.enum(ESTADOS_PEDIDO),
  nota: z.string().optional(),
  sena: senaSchema.optional(),
  entregadoEn: z.string().optional(),
  canceladoEn: z.string().optional(),
  /** Lo que falta cobrar al entregar: el total menos la seña */
  saldo: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** GET /api/pedidos: una página, del más nuevo al más viejo */
export const paginaPedidosSchema = z.object({
  pedidos: z.array(pedidoSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalPedidos: z.number().int(),
  totalPaginas: z.number().int(),
});

/** GET /api/pedidos/:id y todas las acciones (seña, entrega, cancelación): el pedido con los datos del cliente */
export const detallePedidoSchema = pedidoSchema.extend({
  cliente: z
    .object({
      _id: z.string(),
      nombre: z.string(),
      /** E.164: +5491155551234 */
      telefono: z.string(),
      createdAt: z.string(),
      /** Cuántos pedidos hizo en total, contando este */
      cantidadPedidos: z.number().int(),
    })
    .nullable(),
});

// ── Formulario ────────────────────────────────────────────────────────────────

/** El monto de la seña, en pesos enteros. Que no pase del total lo revisa el hook, que conoce el pedido */
export const formularioSenaSchema = z.object({
  monto: z
    .string()
    .trim()
    .min(1, 'Escribí cuánto te transfirió')
    .regex(/^\d+$/, 'Solo números, sin puntos ni comas')
    .refine((valor) => Number(valor) > 0, 'Tiene que ser mayor que 0'),
});
