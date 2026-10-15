const formato = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

/** 1500 → "$ 1.500" */
export function formatearPrecio(precio: number): string {
  return formato.format(precio);
}
