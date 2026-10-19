import type { z } from 'zod';
import type {
  AGRUPACIONES,
  balanceSchema,
  clientesDelRangoSchema,
  compraInsumoSchema,
  DIAS_DE_LA_SEMANA,
  gastoEnInsumosSchema,
  gastoInsumoSchema,
  gustosMasVendidosSchema,
  gustoVendidoSchema,
  ORDENES_PRODUCTOS,
  productosMasVendidosSchema,
  productoVendidoSchema,
  resumenPedidosSchema,
} from './schemas';

export type ProductosMasVendidos = z.infer<typeof productosMasVendidosSchema>;
export type ProductoVendido = z.infer<typeof productoVendidoSchema>;
export type OrdenProductos = (typeof ORDENES_PRODUCTOS)[number];

/** Lo que viaja en la query. Lo que está en undefined no viaja */
export interface FiltrosProductosVendidos {
  /** AAAA-MM-DD, día de Argentina, incluido */
  desde?: string;
  hasta?: string;
  orden?: OrdenProductos;
  pagina?: number;
  /** El back acepta hasta 100 */
  limite?: number;
}

export type GustosMasVendidos = z.infer<typeof gustosMasVendidosSchema>;
export type GustoVendido = z.infer<typeof gustoVendidoSchema>;
export type ResumenPedidos = z.infer<typeof resumenPedidosSchema>;
export type DiaDeLaSemana = (typeof DIAS_DE_LA_SEMANA)[number];
export type ClientesDelRango = z.infer<typeof clientesDelRangoSchema>;
export type CompraInsumo = z.infer<typeof compraInsumoSchema>;
export type GastoInsumo = z.infer<typeof gastoInsumoSchema>;
export type GastoEnInsumos = z.infer<typeof gastoEnInsumosSchema>;
export type Balance = z.infer<typeof balanceSchema>;
export type PuntoBalance = Balance['serie'][number];
export type Agrupacion = (typeof AGRUPACIONES)[number];

/** El rango que aceptan todas las métricas: días AAAA-MM-DD de Argentina, incluidos. Lo que está en undefined no viaja */
export interface Rango {
  desde?: string;
  hasta?: string;
}

export interface FiltrosGustos extends Rango {
  orden?: OrdenProductos;
}

export interface FiltrosBalance extends Rango {
  /** Por defecto, mes */
  agrupar?: Agrupacion;
}
