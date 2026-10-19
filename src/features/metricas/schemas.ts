import { z } from 'zod';
import { UNIDADES_INSUMO } from '@/features/insumos';

/** Por qué se ordena el ranking de productos */
export const ORDENES_PRODUCTOS = ['unidades', 'importe'] as const;

const dia = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const entero = z.number().int().nonnegative();

/** Un producto del ranking. Nombre, id y gusto son los de su última venta */
export const productoVendidoSchema = z.object({
  nombre: z.string(),
  /** Puede ya no existir (si se borró): abrir su detalle daría 404 */
  productoId: z.string(),
  /** El gusto al momento de la venta. Sin enum: si la lista de gustos cambia, lo vendido antes sigue valiendo */
  categoria: z.string(),
  unidades: entero,
  /** Lo que se cobró por ese producto: precio del momento × cantidad */
  importe: z.number().nonnegative(),
  /** En cuántos pedidos salió */
  pedidos: entero,
});

/** GET /api/metricas/productos: los más vendidos (pedidos no cancelados, por el día en que se hicieron) en el rango */
export const productosMasVendidosSchema = z.object({
  /** Como se pidieron, null si no vinieron */
  desde: dia.nullable(),
  hasta: dia.nullable(),
  orden: z.enum(ORDENES_PRODUCTOS),
  /** Los totales son de todo el rango, no de la página: sirven para el porcentaje de cada producto */
  totalPedidos: entero,
  totalUnidades: entero,
  totalImporte: z.number().nonnegative(),
  productos: z.array(productoVendidoSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalProductos: entero,
  totalPaginas: entero,
});

// ── Lo nuevo de metrica-app ──────────────────────────────────────────────────

/** De a cuánto se agrupa la serie del balance. La semana empieza el lunes */
export const AGRUPACIONES = ['dia', 'semana', 'mes'] as const;
export const DIAS_DE_LA_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

/** Cómo se pidió el rango: null si no vino */
const rango = { desde: dia.nullable(), hasta: dia.nullable() };
const monto = z.number().nonnegative();

/** Lo vendido de un gusto */
export const gustoVendidoSchema = z.object({
  /** Sin enum: si la lista de gustos cambia, lo vendido antes sigue valiendo */
  gusto: z.string(),
  unidades: entero,
  importe: monto,
  /** En cuántos pedidos salió algo de ese gusto */
  pedidos: entero,
});

/** GET /api/metricas/gustos: todos los gustos de la lista (también los que no se vendieron, en 0), del que más se vende */
export const gustosMasVendidosSchema = z.object({
  ...rango,
  orden: z.enum(ORDENES_PRODUCTOS),
  totalPedidos: entero,
  totalUnidades: entero,
  totalImporte: monto,
  gustos: z.array(gustoVendidoSchema),
});

/** GET /api/metricas/pedidos: los pedidos hechos en el rango, con el estado que tienen hoy */
export const resumenPedidosSchema = z.object({
  ...rango,
  totalPedidos: entero,
  porEstado: z.object({ pendiente: entero, confirmado: entero, entregado: entero, cancelado: entero }),
  porOrigen: z.object({ web: entero, manual: entero }),
  /** De 0 a 100, con 2 decimales */
  porcentajeCancelados: z.number().min(0).max(100),
  /** El total promedio de las ventas (sin los cancelados) */
  ticketPromedio: monto,
  /** Siempre los siete, de lunes a domingo */
  porDiaDeLaSemana: z.array(z.object({ dia: z.enum(DIAS_DE_LA_SEMANA), pedidos: entero })),
});

/** GET /api/metricas/clientes: los que compraron en el rango (sin contar pedidos cancelados) */
export const clientesDelRangoSchema = z.object({
  ...rango,
  totalClientes: entero,
  /** Su primera compra fue en el rango */
  nuevos: entero,
  /** Ya habían comprado antes del rango. nuevos + recurrentes = totalClientes */
  recurrentes: entero,
  /** Compraron dos veces o más en el rango */
  conVariosPedidos: entero,
});

/** Una compra de un insumo: el día, lo que pagó y cuánto vino */
export const compraInsumoSchema = z.object({
  fecha: dia,
  precio: z.number().positive(),
  /** Cuánto vino, en su unidad. null en las compras cargadas antes de que existiera (van juntas) */
  cantidad: z.number().positive().nullish(),
  unidad: z.enum(UNIDADES_INSUMO).nullish(),
  /** precio / cantidad: lo que salió el kilo, el litro o la unidad. null si no dice cuánto vino */
  precioPorUnidad: z.number().nullish(),
});

/** Un insumo con lo que se gastó en el rango y cuánto aumentó */
export const gastoInsumoSchema = z.object({
  insumoId: z.string(),
  nombre: z.string(),
  gastado: monto,
  compras: entero,
  /** La última compra del rango */
  ultimaCompra: compraInsumoSchema,
  /** La compra anterior a esa, aunque sea de antes del rango. null si es la primera */
  compraAnterior: compraInsumoSchema.nullable(),
  /**
   * En %: cuánto subió (negativo si bajó) respecto de la compra anterior, por kilo, litro o unidad si las dos dicen
   * cuánto vino. null si no hay anterior o no se pueden comparar (solo una dice cuánto vino, o en otra unidad)
   */
  variacion: z.number().nullable(),
  /** Las compras del rango, de la más vieja a la más nueva */
  precios: z.array(compraInsumoSchema),
});

/** GET /api/metricas/insumos: los insumos con alguna compra en el rango, del que más se gastó */
export const gastoEnInsumosSchema = z.object({
  ...rango,
  totalGastado: monto,
  totalCompras: entero,
  insumos: z.array(gastoInsumoSchema),
});

/** GET /api/metricas/balance: lo que entra por ventas, lo que sale en insumos y la ganancia */
export const balanceSchema = z.object({
  ...rango,
  agrupar: z.enum(AGRUPACIONES),
  ingresos: monto,
  gastos: monto,
  /** ingresos − gastos: puede ser negativa */
  ganancia: z.number(),
  /** De las ventas que no se entregaron todavía, lo que falta cobrar (el total menos la seña) */
  porCobrar: monto,
  pedidos: entero,
  compras: entero,
  /** Todos los períodos del rango (también los que dieron 0), hasta hoy */
  serie: z.array(
    z.object({
      /** dia y semana: AAAA-MM-DD (la semana, su lunes); mes: AAAA-MM */
      periodo: z.string(),
      ingresos: monto,
      gastos: monto,
      ganancia: z.number(),
    })
  ),
});
