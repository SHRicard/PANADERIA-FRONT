import type { LogInsumo } from './types';

const CAMPO: Record<LogInsumo['cambios'][number], string> = { nombre: 'el nombre', precio: 'el precio', fecha: 'la fecha' };

/** Qué pasó en una entrada del historial: "Alta del insumo", "Cambió el precio y la fecha" */
export function textoEntrada(log: LogInsumo): string {
  if (log.accion === 'creacion') return 'Alta del insumo';
  const partes = log.cambios.map((campo) => CAMPO[campo]);
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}` : partes[0];
  return `Cambió ${lista}`;
}

/** Cuánto subió o bajó el precio respecto de la entrada anterior: "+12%", "−90%"; null si no cambió */
export function variacion(precio: number, anterior: number): string | null {
  if (precio === anterior || anterior <= 0) return null;
  const porcentaje = Math.round(((precio - anterior) / anterior) * 100);
  return porcentaje > 0 ? `+${porcentaje}%` : `−${Math.abs(porcentaje)}%`;
}
