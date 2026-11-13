import { formatearDia } from '@/shared/utils';

/** Qué parte del total se paga por adelantado, para que empiecen a prepararlo */
export const SENA_PORCENTAJE = 50;

/** La seña, en pesos enteros: si la mitad da con centavos, se redondea para arriba */
export function montoSena(total: number): number {
  return Math.ceil((total * SENA_PORCENTAJE) / 100);
}

export interface Cobro {
  /** Lo que se paga por adelantado */
  sena: number;
  /** Lo que queda para la entrega */
  resto: number;
}

/** Cómo se paga el pedido: la seña ahora y el resto en la entrega */
export function cobroDelPedido(total: number): Cobro {
  const sena = montoSena(total);
  return { sena, resto: total - sena };
}

export interface Entrega {
  /** «Para el miércoles 25 de noviembre.» */
  texto: string;
  /** Una línea más chica debajo. null si no hace falta */
  aclaracion: string | null;
}

/** El día que eligió, para el resumen. null mientras no eligió ninguno */
export function entregaDelDia(dia: string | null): Entrega | null {
  if (!dia) return null;
  return { texto: `Para el ${formatearDia(dia)}.`, aclaracion: null };
}
