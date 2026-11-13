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
  /** 0 = el dueño lo confirmó sin seña */
  monto: z.number().nonnegative(),
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
  /**
   * Si el dueño ya lo vio: los de la web llegan en false (se marcan como nuevos) hasta que toca «Marcar como visto»;
   * los manuales, en true. Los de antes salen en true. El default, por si el back todavía no lo manda
   */
  visto: z.boolean().default(true),
  /**
   * true: hay que mandárselo · false: lo pasa a retirar. Los de antes salen en false. El default, por si el back
   * todavía no lo manda
   */
  conEnvio: z.boolean().default(false),
  /**
   * Para qué día es (AAAA-MM-DD). null en los pedidos de antes de la agenda, hasta que el back corra la migración.
   * El default, por si el back todavía no lo manda
   */
  fechaEntrega: z.string().nullable().default(null),
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

/** GET /api/pedidos/:id y todas las acciones (seña, entrega, cancelación, envío, productos): el pedido con los datos del cliente */
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

// ── Agenda ────────────────────────────────────────────────────────────────────

/** El estado de un día: bajo (verde, «Libre») hasta el 40 % del tope, medio (amarillo, «Casi»), alto (rojo, llegó al tope) */
export const NIVELES_AGENDA = ['bajo', 'medio', 'alto'] as const;

/** Un día de la agenda */
export const diaAgendaSchema = z.object({
  /** AAAA-MM-DD */
  fecha: z.string(),
  /** Pedidos no cancelados para ese día (también los pendientes y los manuales) */
  pedidos: z.number().int(),
  /** La suma de las cantidades: un pack de 50 chipás es 1, 3 tartas son 3 */
  productos: z.number().int(),
  /**
   * Qué tan lleno está contra los productos por día del dueño: bajo (libre), medio (casi) o alto (llegó al tope). null
   * mientras no los puso. z.string(): si el back suma un nivel, no se rompe
   */
  nivel: z.string().nullable(),
  /** Si el dueño lo marcó como «Agenda llena»: la web no lo deja elegir */
  llena: z.boolean(),
  /**
   * Cuántos productos quiere hacer el dueño ese día, si es menos que su tope de siempre (null = los de siempre). Lo que
   * no quiere hacer el back lo cuenta como ocupado: `nivel` y `tope` ya vienen con eso. default: el back de antes no lo manda
   */
  quiereHacer: z.number().int().nullable().default(null),
  /** Si llegó a los productos por día del dueño (su tope): la web tampoco lo deja elegir. default: el back de antes no lo manda */
  tope: z.boolean().default(false),
  /**
   * Cuántos productos le quedan por preparar: los de sus pedidos sin entregar menos lo que el dueño anotó como hecho.
   * Solo viene en la agenda del mes (no al marcar «Agenda llena»)
   */
  faltan: z.number().int().optional(),
});

/** GET /api/agenda?mes=AAAA-MM: todos los días del mes */
/**
 * GET (y PUT) /api/agenda/:fecha/productos: lo que hay que preparar ese día, sumado de todos sus pedidos que falta
 * entregar (sin importar de quién son), con cuántos ya hizo el dueño. Primero lo que falta, los listos al final.
 * `sinSena`: cuántos de esa cantidad son de pedidos que todavía no pagaron la seña
 */
export const produccionDelDiaSchema = z.object({
  fecha: z.string(),
  pedidos: z.number().int(),
  total: z.number().int(),
  hechos: z.number().int(),
  productos: z.array(
    z.object({
      productoId: z.string(),
      nombre: z.string(),
      cantidad: z.number().int(),
      sinSena: z.number().int(),
      hechos: z.number().int(),
      faltan: z.number().int(),
      listo: z.boolean(),
    }),
  ),
});

export const agendaSchema = z.object({
  mes: z.string(),
  productosPorDia: z.number().int().nullable(),
  dias: z.array(diaAgendaSchema),
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
  /** true: hay que mandárselo · false: lo pasa a retirar */
  conEnvio: z.boolean(),
  /** Cualquier día: el dueño no tiene las reglas de la web. Vacío = todavía no eligió */
  fechaEntrega: z.string().min(1, 'Elegí para qué día es'),
});

/** La referencia de la agenda: un entero de 1 a 1000, o vacío para sacarla */
/** «¿Cuántos querés hacer este día?»: un entero de 1 a 1000 (para no hacer nada está «Agenda llena») */
export const formularioQuiereHacerSchema = z.object({
  quiereHacer: z
    .string()
    .trim()
    .min(1, 'Escribí cuántos productos querés hacer')
    .regex(/^\d+$/, 'Solo números, sin puntos ni comas')
    .refine((valor) => Number(valor) >= 1 && Number(valor) <= 1000, 'De 1 a 1000. Para no hacer nada, usá «Agenda llena»'),
});

export const formularioProductosPorDiaSchema = z.object({
  productosPorDia: z
    .string()
    .trim()
    .refine((valor) => valor === '' || /^\d+$/.test(valor), 'Solo números')
    .refine((valor) => valor === '' || (Number(valor) >= 1 && Number(valor) <= 1000), 'De 1 a 1000'),
});
