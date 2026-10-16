/**
 * Con cuántas horas hay que encargarlo, para mostrar: 24 → "Con 24 hs de anticipación";
 * 72 → "Con 3 días de anticipación". 0 = se pide en el momento: null, no se muestra nada
 */
export function textoAnticipacion(horas: number): string | null {
  if (horas <= 0) return null;
  const tiempo = horas >= 72 && horas % 24 === 0 ? `${horas / 24} días` : `${horas} hs`;
  return `Con ${tiempo} de anticipación`;
}
