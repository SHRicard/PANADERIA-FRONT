/**
 * Un número entre 0 y 1, siempre el mismo para el mismo índice y la misma semilla: los copos y las luces no cambian de
 * lugar de un render al otro (ni entre el HTML prerenderizado y el navegador)
 */
export function azar(indice: number, semilla: number): number {
  const x = Math.sin(indice * 12.9898 + semilla * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
