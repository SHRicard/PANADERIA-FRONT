import type { Anticipacion } from '@/features/catalogo';
import { nombreParaMostrar, textoHoras } from '@/shared/utils';

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
  /** Las horas del producto que más se demora */
  horas: number;
  /** «Va a estar listo 48 hs después de pagar la seña.» */
  texto: string;
  /** Cuál lo marca, si hay más de un producto con distintas demoras. null si no hace falta decirlo */
  aclaracion: string | null;
}

/**
 * Cuándo está listo el pedido: cuando lo está el producto que más se demora (uno de 24 hs y otro de 48 hs →
 * 48 hs después de la seña). null si no se sabe la anticipación de ninguno (el catálogo todavía carga)
 */
export function entregaDelPedido(
  productoIds: string[],
  anticipacionDe: (productoId: string) => Anticipacion | undefined,
): Entrega | null {
  const conocidas = productoIds.map(anticipacionDe).filter((anticipacion) => anticipacion !== undefined);
  if (conocidas.length === 0) return null;
  const mayor = conocidas.reduce((mayor, anticipacion) => (anticipacion.horas > mayor.horas ? anticipacion : mayor));
  const distintas = new Set(conocidas.map(({ horas }) => horas)).size > 1;

  return {
    horas: mayor.horas,
    texto:
      mayor.horas > 0
        ? `Va a estar listo ${textoHoras(mayor.horas)} después de pagar la seña.`
        : 'Va a estar listo apenas pagues la seña.',
    aclaracion: distintas
      ? `Lo marca ${nombreParaMostrar(mayor.nombre)}, que se encarga con ${textoHoras(mayor.horas)}.`
      : null,
  };
}
