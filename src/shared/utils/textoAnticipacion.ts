/** Una cantidad de horas, para leer: 24 → "24 hs"; 72 → "3 días" (desde 3 días, si son días enteros) */
export function textoHoras(horas: number): string {
  return horas >= 72 && horas % 24 === 0 ? `${horas / 24} días` : `${horas} hs`;
}

/**
 * Con cuántas horas hay que encargarlo, para mostrar: 24 → "Con 24 hs de anticipación";
 * 72 → "Con 3 días de anticipación". 0 = se pide en el momento: null, no se muestra nada
 */
export function textoAnticipacion(horas: number): string | null {
  if (horas <= 0) return null;
  return `Con ${textoHoras(horas)} de anticipación`;
}
