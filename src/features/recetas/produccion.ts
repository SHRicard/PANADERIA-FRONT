// Realizar la receta: cuánto hace falta de cada ingrediente para hacer las unidades que le pidieron al dueño ("tengo
// que hacer 24 chipás"). La cuenta la hace el back (GET /api/recetas/:productoId/produccion); acá, las reglas de lo
// que se escribe, las mismas que el back

/** El límite del back */
export const UNIDADES_A_HACER_MAX = 10000;

/** Por qué no sirve lo que escribió; null si sirve o si está vacío (vacío = la receta de siempre) */
export function errorDeUnidades(texto: string): string | null {
  const limpio = texto.trim();
  if (!limpio) return null;
  if (!/^\d+$/.test(limpio)) return 'Solo números enteros, sin puntos ni comas';
  const unidades = Number(limpio);
  if (unidades < 1) return 'Tiene que ser 1 o más';
  if (unidades > UNIDADES_A_HACER_MAX) return `Puede ser hasta ${UNIDADES_A_HACER_MAX}`;
  return null;
}

/** Las unidades escritas; null si está vacío o no sirve */
export function leerUnidades(texto: string): number | null {
  const limpio = texto.trim();
  return limpio && !errorDeUnidades(limpio) ? Number(limpio) : null;
}
