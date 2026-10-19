import { z } from 'zod';

export const ESTADOS_PEDIDO = ['pendiente', 'confirmado', 'entregado', 'cancelado'] as const;

/** web: lo hizo el cliente desde la web · manual: lo cargó el dueño desde la app */
export const ORIGENES_PEDIDO = ['web', 'manual'] as const;

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
  /** Los pedidos de antes de este campo salen como web. El default, por si el back todavía no lo manda */
  origen: z.enum(ORIGENES_PEDIDO).default('web'),
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

/** GET /api/clientes: los que ya hicieron algún pedido, el del pedido más reciente primero */
export const clientesSchema = z.array(
  z.object({
    _id: z.string(),
    nombre: z.string(),
    /** E.164: +5491155551234 */
    telefono: z.string(),
    cantidadPedidos: z.number().int(),
    /** La fecha del último pedido, o null si no tiene */
    ultimoPedido: z.string().nullable(),
  }),
);

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

/** Hasta cuántos productos distintos y cuántas unidades de cada uno acepta el back en un pedido */
export const MAX_PRODUCTOS_PEDIDO = 30;
export const MAX_UNIDADES_PRODUCTO = 50;

// Pesos enteros, como el monto de la seña del detalle. Vacía = sin seña
const senaOpcional = z
  .string()
  .trim()
  .refine((valor) => valor === '' || /^\d+$/.test(valor), 'Solo números, sin puntos ni comas')
  .refine((valor) => valor === '' || Number(valor) > 0, 'Tiene que ser mayor que 0');

/**
 * El pedido manual: los datos del cliente, la nota y la seña. Las mismas reglas que el back. Los productos van
 * aparte (los elige el hook), y que la seña no pase del total también lo revisa el hook, que conoce el total
 */
export const formularioPedidoManualSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribí el nombre del cliente').max(60, 'El nombre puede tener hasta 60 letras'),
  telefono: z
    .string()
    .trim()
    .min(1, 'Escribí el teléfono del cliente')
    .refine((valor) => /^[+\d\s().-]+$/.test(valor) && valor.replace(/\D/g, '').length >= 8, 'Revisá el teléfono: por ejemplo, 11 5555-1234'),
  nota: z.string().trim().max(300, 'La nota puede tener hasta 300 letras'),
  sena: senaOpcional,
});
