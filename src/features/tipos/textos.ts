import type { Tipo } from './types';

/** «Ningún producto», «1 producto», «3 productos» */
export function cantidadDeProductos(cantidad: number): string {
  return cantidad === 0 ? 'Ningún producto' : cantidad === 1 ? '1 producto' : `${cantidad} productos`;
}

/** Qué pasa con los productos al cambiarle el nombre */
export function textoRenombre(tipo: Tipo): string {
  if (tipo.cantidadProductos === 0) return 'Ningún producto lo usa todavía.';
  return tipo.cantidadProductos === 1
    ? 'Lo usa 1 producto: el nombre nuevo sale ahí sin tocarlo.'
    : `Lo usan ${tipo.cantidadProductos} productos: el nombre nuevo sale en todos sin tocarlos.`;
}
