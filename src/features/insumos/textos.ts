import { formatearPrecio } from '@/shared/utils';
import type { LogInsumo, UnidadInsumo } from './types';

const CAMPO: Record<LogInsumo['cambios'][number], string> = {
  nombre: 'el nombre',
  precio: 'el precio',
  fecha: 'la fecha',
  cantidad: 'la cantidad',
  unidad: 'la unidad',
};

/** Qué pasó en una entrada del historial: "Alta del insumo", "Cambió el precio y la fecha" */
export function textoEntrada(log: LogInsumo): string {
  if (log.accion === 'creacion') return 'Alta del insumo';
  const partes = log.cambios.map((campo) => CAMPO[campo]);
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}` : partes[0];
  return `Cambió ${lista}`;
}

/** Para el Segmentado del formulario */
export const TEXTO_UNIDAD: Record<UnidadInsumo, string> = { kg: 'Kilos', l: 'Litros', unidad: 'Unidades' };

const numero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 3 });

/** 25, kg → "25 kg"; 0.5, kg → "0,5 kg"; 30, unidad → "30 unidades"; 1, unidad → "1 unidad" */
export function textoCantidad(cantidad: number, unidad: UnidadInsumo): string {
  if (unidad === 'unidad') return `${numero.format(cantidad)} ${cantidad === 1 ? 'unidad' : 'unidades'}`;
  return `${numero.format(cantidad)} ${unidad}`;
}

/** 25.000 por 25 kg → "$ 1.000 el kg"; por 30 unidades → "$ 833 c/u". null si la compra no dice cuánto vino */
export function textoPrecioPorUnidad({ precio, cantidad, unidad }: Pick<LogInsumo, 'precio' | 'cantidad' | 'unidad'>): string | null {
  if (!cantidad || !unidad) return null;
  const porUnidad = formatearPrecio(Math.round(precio / cantidad));
  return unidad === 'unidad' ? `${porUnidad} c/u` : `${porUnidad} el ${unidad}`;
}

type DatosDePrecio = Pick<LogInsumo, 'precio' | 'cantidad' | 'unidad'>;

/**
 * Cuánto subió o bajó respecto de la entrada anterior: "+12%", "−90%"; null si no cambió o no se puede comparar.
 * La misma cuenta que el back: por kilo, litro o unidad si las dos dicen cuánto vino en la misma unidad (10 kg a
 * 20.000 y 25 kg a 25.000 es −50%); por precio si ninguna lo dice (las de antes); si solo una lo dice, no se compara
 */
export function variacion(entrada: DatosDePrecio, anterior: DatosDePrecio): string | null {
  let actual: number;
  let antes: number;
  if (entrada.cantidad && anterior.cantidad) {
    if (entrada.unidad !== anterior.unidad) return null;
    actual = entrada.precio / entrada.cantidad;
    antes = anterior.precio / anterior.cantidad;
  } else if (!entrada.cantidad && !anterior.cantidad) {
    actual = entrada.precio;
    antes = anterior.precio;
  } else {
    return null;
  }
  if (antes <= 0) return null;
  const porcentaje = Math.round(((actual - antes) / antes) * 100);
  if (porcentaje === 0) return null;
  return porcentaje > 0 ? `+${porcentaje}%` : `−${Math.abs(porcentaje)}%`;
}
