import { z } from 'zod';

/** Un producto del carrito, con el precio de hoy */
export const itemCotizadoSchema = z.object({
  productoId: z.string(),
  nombre: z.string(),
  precio: z.number(),
  cantidad: z.number().int(),
  subtotal: z.number(),
  /** Miniatura de la primera foto, o null si no tiene */
  portada: z.url().nullable(),
});

/** POST /api/carrito */
export const cotizacionSchema = z.object({
  items: z.array(itemCotizadoSchema),
  /** Ids de los productos que ya no se pueden pedir (pausados o eliminados): no suman en el total */
  noDisponibles: z.array(z.string()),
  cantidadTotal: z.number().int(),
  total: z.number(),
});

/** POST /api/pedidos: el pedido recién creado */
export const pedidoCreadoSchema = z.object({
  id: z.string(),
  items: z.array(
    z.object({
      producto: z.string(),
      nombre: z.string(),
      precio: z.number(),
      categoria: z.string(),
      cantidad: z.number().int(),
    }),
  ),
  total: z.number(),
  estado: z.enum(['pendiente', 'confirmado', 'entregado', 'cancelado']),
  createdAt: z.string(),
});

/** Lo que guarda el navegador. Si se rompió o es de otra versión, el carrito arranca vacío */
export const carritoGuardadoSchema = z
  .array(z.object({ productoId: z.string(), cantidad: z.number().int().min(1).max(50) }))
  .max(30);

// ── Formulario ────────────────────────────────────────────────────────────────

/** Los datos del cliente para confirmar. Las mismas reglas que el back, para avisar antes de mandar */
export const formularioPedidoSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribí tu nombre').max(60, 'El nombre puede tener hasta 60 letras'),
  telefono: z
    .string()
    .trim()
    .min(1, 'Escribí tu teléfono')
    .refine((valor) => /^[+\d\s().-]+$/.test(valor) && valor.replace(/\D/g, '').length >= 8, 'Revisá el teléfono: por ejemplo, 11 5555-1234'),
  nota: z.string().trim().max(300, 'La nota puede tener hasta 300 letras'),
});
