// El precio de venta que sale de la receta: lo que cuesta cada unidad × lo que elige el dueño (×3: lo que cuesta
// $ 28 se vende a $ 84). Las mismas reglas y la misma cuenta que el back

/** Mayor que 1 (con ×1 no gana nada), hasta 10 y con un decimal como mucho (×2,5) */
export const MULTIPLICADOR_MAX = 10;

/** Lo que cuesta cada unidad × el multiplicador, redondeado al peso. La misma cuenta que hace el back al guardarlo */
export function precioDeVenta(costoPorUnidad: number, multiplicador: number): number {
  return Math.round(costoPorUnidad * multiplicador);
}

/** Por qué no sirve lo que escribió en «Otro» ("2,5" o "2.5"); null si sirve */
export function errorDeMultiplicador(texto: string): string | null {
  const limpio = texto.trim();
  if (!limpio) return 'Escribí por cuánto';
  if (!/^\d+([.,]\d)?$/.test(limpio)) return 'Un número, con un decimal como mucho (por ejemplo, 2,5)';
  const valor = Number(limpio.replace(',', '.'));
  if (valor <= 1) return 'Tiene que ser más que 1: con ×1 no ganás nada';
  if (valor > MULTIPLICADOR_MAX) return `Puede ser hasta ${MULTIPLICADOR_MAX}`;
  return null;
}

/** "2,5" → 2.5; null si no sirve */
export function leerMultiplicador(texto: string): number | null {
  return errorDeMultiplicador(texto) ? null : Number(texto.trim().replace(',', '.'));
}

// ── Redondeo ──────────────────────────────────────────────────────────────────
// ×2 da $ 11.691 y el dueño lo quiere en $ 12.000: se redondea siempre para arriba, así nunca gana menos de lo que
// eligió

/** A qué múltiplo se puede redondear. Los mismos que acepta el back */
export const REDONDEOS = [10, 50, 100, 500, 1000] as const;

/** Hasta cuánto puede subir al redondearlo (un 10 %): más, ya no es redondear sino cobrar otra cosa */
const REDONDEO_TOPE = 1.1;

/** Al múltiplo de arriba: $ 11.691 con 1000 → $ 12.000. La misma cuenta que el back */
export function redondearPrecio(precio: number, redondeo: number): number {
  return Math.ceil(precio / redondeo) * redondeo;
}

export interface PrecioRedondeado {
  /** Lo que viaja al back: 10, 50, 100, 500 o 1000 */
  redondeo: number;
  precio: number;
}

export interface OpcionesDeRedondeo {
  /** La más cercana ($ 11.691 → $ 11.700); null si da lo mismo que `redondo` */
  cerca: PrecioRedondeado | null;
  /** La más redonda ($ 11.691 → $ 12.000); null si no hay cómo redondearlo */
  redondo: PrecioRedondeado | null;
}

/**
 * Las formas de redondear que se ofrecen: la más cercana y la más redonda. Puede no haber ninguna: ya es redondo
 * ($ 25.000) o redondearlo lo subiría más de un 10 % ($ 84 → $ 100)
 */
export function opcionesDeRedondeo(precio: number): OpcionesDeRedondeo {
  if (precio <= 0) return { cerca: null, redondo: null };
  // Cada precio con el redondeo más grande que lo da: $ 12.000 sale con 500 y con 1000, y se guarda 1000
  const posibles = new Map<number, number>();
  for (const redondeo of REDONDEOS) {
    const redondeado = redondearPrecio(precio, redondeo);
    if (redondeado > precio && redondeado <= precio * REDONDEO_TOPE) posibles.set(redondeado, redondeo);
  }
  // Los redondeos van de menor a mayor, así que los precios también
  const lista = [...posibles].map(([valor, redondeo]) => ({ precio: valor, redondeo }));
  const redondo = lista.at(-1) ?? null;
  const cerca = lista.length > 1 ? (lista.at(0) ?? null) : null;
  return { cerca, redondo };
}

/** Lo que queda por unidad entre el precio de venta y lo que cuesta hacerla, sin el ruido de los decimales */
export function gananciaPorUnidad(precio: number, costo: number): number {
  // El costo tiene centavos: 140 − 46,67 da 93,33000000000001
  return Math.round((precio - costo) * 100) / 100;
}
