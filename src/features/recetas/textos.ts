import { formatearPrecio } from '@/shared/utils';
import { gananciaPorUnidad } from './precio';
import type { UnidadReceta } from './types';

/**
 * Cómo lee los pesos el dueño: de 1 a 999 en gramos; los kilos enteros o con medio, en kilos; el resto, en gramos.
 * 250 → "250 gramos", 1000 → "1 kilo", 1500 → "1 kilo y medio", 1750 → "1750 gramos", 2000 → "2 kilos"
 */
export function textoGramos(gramos: number): string {
  if (gramos < 1000) return `${gramos} ${gramos === 1 ? 'gramo' : 'gramos'}`;
  const kilos = Math.floor(gramos / 1000);
  const resto = gramos % 1000;
  const palabra = kilos === 1 ? 'kilo' : 'kilos';
  if (resto === 0) return `${kilos} ${palabra}`;
  if (resto === 500) return `${kilos} ${palabra} y medio`;
  return `${gramos} gramos`;
}

/** 1500, g → "1 kilo y medio"; 2, unidad → "2 unidades" */
export function textoCantidadReceta(cantidad: number, unidad: UnidadReceta): string {
  if (unidad === 'g') return textoGramos(cantidad);
  return `${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'}`;
}

// Los costos pueden tener centavos ($ 0,40 de sal): formatearPrecio los redondea al peso
const sinCentavos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const conCentavos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 28 → "$ 28"; 32.5 → "$ 32,50"; 0.4 → "$ 0,40" */
export function textoCosto(valor: number): string {
  return Number.isInteger(valor) ? sinCentavos.format(valor) : conCentavos.format(valor);
}

/** Cuántas veces la receta: 1 → "1 receta"; 2 → "2 recetas"; 2.5 → "2,5 recetas" */
export function textoVeces(veces: number): string {
  return `${String(veces).replace('.', ',')} ${veces === 1 ? 'receta' : 'recetas'}`;
}

/** 3 → "×3"; 2.5 → "×2,5" */
export function textoMultiplicador(multiplicador: number): string {
  return `×${String(multiplicador).replace('.', ',')}`;
}

/** Lo que queda por unidad entre el precio de venta y lo que cuesta hacerla: "Ganás $ 56 por unidad" */
export function textoGanancia(precio: number, costo: number): string {
  const diferencia = gananciaPorUnidad(precio, costo);
  if (diferencia === 0) return 'No ganás nada: lo vendés a lo que te cuesta';
  return diferencia > 0 ? `Ganás ${textoCosto(diferencia)} por unidad` : `Perdés ${textoCosto(-diferencia)} por unidad`;
}

/** Cuánto cambia el precio de hoy: "Baja $ 13.000 · −52%", "Sube $ 2.000 · +8%". Con menos de 1 %, sin porcentaje */
export function textoCambioPrecio(actual: number, nuevo: number): string {
  const diferencia = nuevo - actual;
  const monto = `${diferencia < 0 ? 'Baja' : 'Sube'} ${formatearPrecio(Math.abs(diferencia))}`;
  const porcentaje = actual > 0 ? Math.round((diferencia / actual) * 100) : 0;
  if (porcentaje === 0) return monto;
  return `${monto} · ${porcentaje > 0 ? '+' : '−'}${Math.abs(porcentaje)}%`;
}
