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

/**
 * Los días que el cliente puede elegir para este carrito (AAAA-MM-DD). Los calcula el back con la anticipación del
 * producto que más demora: desde mañana o pasado, hasta fin de mes (o fin del mes siguiente si faltan 7 días o
 * menos). `diasLlenos`: los que el dueño marcó como «Agenda llena». `diasCasiLlenos`: los que se están llenando o
 * llegaron al tope del dueño (se pueden elegir; la web los muestra en amarillo). El tope no cierra ningún día. Con `default`, por si el back todavía no lo manda
 */
export const entregaSchema = z.object({
  desde: z.string(),
  hasta: z.string(),
  diasLlenos: z.array(z.string()),
  diasCasiLlenos: z.array(z.string()).default([]),
});

/** POST /api/carrito */
export const cotizacionSchema = z.object({
  items: z.array(itemCotizadoSchema),
  /** Ids de los productos que ya no se pueden pedir (pausados o eliminados): no suman en el total */
  noDisponibles: z.array(z.string()),
  cantidadTotal: z.number().int(),
  total: z.number(),
  entrega: entregaSchema,
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
  /**
   * Si va con envío. El default: el pedido confirmado queda guardado en el navegador, y uno guardado antes de este
   * campo no lo tiene (además, por si el back todavía no lo manda)
   */
  conEnvio: z.boolean().default(false),
  /** El día que eligió (AAAA-MM-DD). null en un pedido guardado en el navegador antes de la agenda */
  fechaEntrega: z.string().nullable().default(null),
});

/**
 * Lo que guarda el navegador, leído con tolerancia: cada ítem se revisa aparte (`itemGuardadoSchema`) y las cantidades
 * raras se acomodan en el slice. Si no es una lista (se rompió o es de otra versión), el carrito arranca vacío
 */
export const carritoGuardadoSchema = z.array(z.unknown());

/** Un ítem guardado que se puede rescatar: un id y una cantidad numérica (aunque sea 9999 o 2.7) */
export const itemGuardadoSchema = z.object({ productoId: z.string().min(1), cantidad: z.number().refine(Number.isFinite) });

// ── Formulario ────────────────────────────────────────────────────────────────

/** Los datos del cliente para confirmar. Las mismas reglas que el back, para avisar antes de mandar */
export const formularioPedidoSchema = z.object({
  nombre: z.string().trim().min(1, 'Escribí tu nombre').min(2, 'El nombre tiene que tener al menos 2 letras').max(60, 'El nombre puede tener hasta 60 letras'),
  telefono: z
    .string()
    .trim()
    .min(1, 'Escribí tu teléfono')
    .refine((valor) => /^[+\d\s().-]+$/.test(valor) && valor.replace(/\D/g, '').length >= 8, 'Revisá el teléfono: por ejemplo, 11 5555-1234'),
  nota: z.string().trim().max(300, 'La nota puede tener hasta 300 letras'),
  /** true: quiere que se lo manden · false: lo pasa a retirar */
  conEnvio: z.boolean(),
  /** AAAA-MM-DD, uno de los que ofrece la cotización. Vacío = todavía no eligió */
  fechaEntrega: z.string().min(1, 'Elegí para qué día lo querés'),
});
