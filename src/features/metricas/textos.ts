import { textoCantidad, textoPrecioPorUnidad } from '@/features/insumos';
import type { OpcionSegmentado } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import type { ColorToken } from '@/theme';
import { TEXTO_PERIODO, type Periodo } from './rangos';
import type { Agrupacion, CompraInsumo, DiaDeLaSemana, GastoInsumo, OrdenProductos } from './types';

/** Cuántos se ven de entrada, y con «Ver todos»: el back acepta hasta 100, que en una panadería es el ranking entero */
export const TOP_PRODUCTOS = 10;
export const TODOS_LOS_PRODUCTOS = 100;

/** Cortos, para que entren los cuatro a lo ancho del celular */
export const OPCIONES_PERIODO: readonly OpcionSegmentado<Periodo>[] = [
  { valor: 'semana', label: '7 días' },
  { valor: 'mes', label: 'Este mes' },
  { valor: 'anio', label: 'Este año' },
  { valor: 'todo', label: 'Siempre' },
];

export const OPCIONES_ORDEN: readonly OpcionSegmentado<OrdenProductos>[] = [
  { valor: 'unidades', label: 'Unidades' },
  { valor: 'importe', label: 'Plata' },
];

const numero = new Intl.NumberFormat('es-AR');

/** 1214 → "1.214" */
export const formatearNumero = (valor: number) => numero.format(valor);

/** 1 → "1 unidad"; 1214 → "1.214 unidades" */
export const textoUnidades = (unidades: number) => `${numero.format(unidades)} ${unidades === 1 ? 'unidad' : 'unidades'}`;

/** 1 → "1 pedido"; 14 → "14 pedidos" */
export const textoPedidos = (pedidos: number) => `${numero.format(pedidos)} ${pedidos === 1 ? 'pedido' : 'pedidos'}`;

/** 1 → "1 compra"; 3 → "3 compras" */
export const textoCompras = (compras: number) => `${numero.format(compras)} ${compras === 1 ? 'compra' : 'compras'}`;

/** "23 pedidos · 214 unidades · 12 productos". Sin productos (los gustos), solo los dos primeros */
export function textoTotales(pedidos: number, unidades: number, productos?: number): string {
  const partes = [textoPedidos(pedidos), textoUnidades(unidades)];
  if (productos !== undefined) partes.push(`${numero.format(productos)} ${productos === 1 ? 'producto' : 'productos'}`);
  return partes.join(' · ');
}

/** 16.67 → "17%" */
export const textoPorcentaje = (porcentaje: number) => `${Math.round(porcentaje)}%`;

/** La parte de un total: 3 de 5 → 60. Sin total, 0 */
export const parteDe = (valor: number, total: number) => (total > 0 ? Math.round((valor / total) * 100) : 0);

/** Lo que manda en un ranking: las unidades o la plata */
export const valorSegunOrden = (venta: { unidades: number; importe: number }, orden: OrdenProductos) =>
  orden === 'unidades' ? textoUnidades(venta.unidades) : formatearPrecio(venta.importe);

/** En cuántos pedidos salió y el otro valor: "14 pedidos · $ 67.200" */
export const detalleSegunOrden = (venta: { unidades: number; importe: number; pedidos: number }, orden: OrdenProductos) =>
  [textoPedidos(venta.pedidos), orden === 'unidades' ? formatearPrecio(venta.importe) : textoUnidades(venta.unidades)].join(' · ');

/** "Vendido · Este mes": lo de arriba de cada tarjeta de resumen */
export const etiquetaDelPeriodo = (que: string, periodo: Periodo) =>
  `${que} · ${periodo === 'todo' ? 'Desde el principio' : TEXTO_PERIODO[periodo]}`;

const EN_EL_PERIODO: Record<Periodo, string> = {
  semana: 'en los últimos 7 días',
  mes: 'este mes',
  anio: 'este año',
  todo: '',
};

/** El estado vacío: "Sin ventas este mes"; en «Siempre», "Todavía no hay ventas" */
export const textoSinDatos = (periodo: Periodo, que: string) =>
  periodo === 'todo' ? `Todavía no hay ${que}` : `Sin ${que} ${EN_EL_PERIODO[periodo]}`;

/** "Agridulce, Ácido y Picante" */
export function enumerar(nombres: string[]): string {
  if (nombres.length <= 1) return nombres.join('');
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
}

// ── El balance ────────────────────────────────────────────────────────────────

/** De a cuánto se agrupó, para "tocá el gráfico para ver cada día" */
export const UNIDAD_SERIE: Record<Agrupacion, string> = { dia: 'día', semana: 'semana', mes: 'mes' };

/** El título del gráfico según de a cuánto se agrupó */
export const TITULO_SERIE: Record<Agrupacion, string> = {
  dia: 'Día por día',
  semana: 'Semana por semana',
  mes: 'Mes por mes',
};

const formatoDiaCorto = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' });
const formatoMesCorto = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' });
const formatoMesLargo = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });

// Al mediodía, para que ninguna zona horaria lo corra de día
const mediodia = (periodo: string, agrupar: Agrupacion) =>
  new Date(agrupar === 'mes' ? `${periodo}-15T12:00:00` : `${periodo}T12:00:00`);

/** Debajo del gráfico: "5 oct" (día y semana, su lunes) u "oct 26" (mes) */
export const periodoCorto = (periodo: string, agrupar: Agrupacion) =>
  (agrupar === 'mes' ? formatoMesCorto : formatoDiaCorto).format(mediodia(periodo, agrupar));

/** Al elegir una barra: "5 oct", "Semana del 5 oct", "octubre de 2026" */
export function periodoLargo(periodo: string, agrupar: Agrupacion): string {
  const fecha = mediodia(periodo, agrupar);
  if (agrupar === 'mes') return formatoMesLargo.format(fecha);
  return agrupar === 'semana' ? `Semana del ${formatoDiaCorto.format(fecha)}` : formatoDiaCorto.format(fecha);
}

// ── Los insumos ───────────────────────────────────────────────────────────────

/** Como en el historial de insumos: "+12%", "−8%"; si quedó igual, "igual" */
export function textoVariacion(variacion: number): string {
  const redondeada = Math.round(variacion);
  if (redondeada === 0) return 'igual';
  return redondeada > 0 ? `+${redondeada}%` : `−${Math.abs(redondeada)}%`;
}

/** Que subió es malo para el dueño (rojo); que bajó, bueno (verde) */
export const colorVariacion = (variacion: number): ColorToken =>
  Math.round(variacion) > 0 ? 'danger' : Math.round(variacion) < 0 ? 'success' : 'textMuted';

/** "$ 25.000 por 25 kg, el 15 oct"; si no dice cuánto vino (las de antes), "$ 30.000 el 15 oct" */
export function textoCompra(compra: CompraInsumo): string {
  const dia = formatoDiaCorto.format(mediodia(compra.fecha, 'dia'));
  if (compra.cantidad && compra.unidad) {
    return `${formatearPrecio(compra.precio)} por ${textoCantidad(compra.cantidad, compra.unidad)}, el ${dia}`;
  }
  return `${formatearPrecio(compra.precio)} el ${dia}`;
}

/** Lo que se compara de una compra: "$ 1.000 el kg" si dice cuánto vino; si no, el precio, "$ 30.000" */
export const precioComparable = (compra: CompraInsumo) =>
  textoPrecioPorUnidad({ precio: compra.precio, cantidad: compra.cantidad ?? undefined, unidad: compra.unidad ?? undefined }) ??
  formatearPrecio(compra.precio);

/**
 * Los valores para el mini gráfico, con la misma cuenta que la variación: por kilo, litro o unidad si todas dicen
 * cuánto vino en la misma unidad; el precio si ninguna lo dice; null si se mezclan y no se pueden comparar
 */
export function valoresComparables(compras: CompraInsumo[]): number[] | null {
  const porUnidad = compras.flatMap((compra) => (compra.cantidad && compra.unidad ? [compra.precio / compra.cantidad] : []));
  const unidades = new Set(compras.map((compra) => compra.unidad ?? null));
  if (porUnidad.length === compras.length && unidades.size === 1) return porUnidad;
  if (compras.every((compra) => !compra.cantidad)) return compras.map((compra) => compra.precio);
  return null;
}

/** Para el lector de pantalla: "+11% respecto de la compra anterior, $ 2.000 el kg" */
export function textoCambioDePrecio(insumo: GastoInsumo): string {
  if (!insumo.compraAnterior) return 'Primera compra';
  if (insumo.variacion === null) return 'No se compara con la compra anterior';
  return `${textoVariacion(insumo.variacion)} respecto de la compra anterior, ${precioComparable(insumo.compraAnterior)}`;
}

// ── Los pedidos ───────────────────────────────────────────────────────────────

/** Debajo de cada barra de los días */
export const DIA_CORTO: Record<DiaDeLaSemana, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miércoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sábado: 'Sáb',
  domingo: 'Dom',
};

/** "Se cancelaron 1 de 5: el 20%"; sin cancelados, lo dice */
export function textoCancelados(cancelados: number, total: number, porcentaje: number): string {
  if (cancelados === 0) return 'No se canceló ninguno.';
  if (cancelados === 1) return `Se canceló 1 de ${numero.format(total)}: el ${textoPorcentaje(porcentaje)}.`;
  return `Se cancelaron ${numero.format(cancelados)} de ${numero.format(total)}: el ${textoPorcentaje(porcentaje)}.`;
}

/** El título del aviso de los insumos que subieron */
export const textoAumentos = (cantidad: number) => (cantidad === 1 ? 'Subió 1 insumo' : `Subieron ${numero.format(cantidad)} insumos`);
