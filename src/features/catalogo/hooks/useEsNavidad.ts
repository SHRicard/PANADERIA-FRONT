import { TEMAS_CATALOGO } from '../temas';
import { useEstiloCatalogo } from './useEstiloCatalogo';

/**
 * Si la web está de Navidad (el dueño eligió Navidad de día o de noche): lo usan las otras pantallas públicas (el
 * pedido) para sumar sus dibujos y detalles de fiestas. Los colores ya los pone `TemaCatalogo`
 */
export function useEsNavidad(): boolean {
  const { estilo } = useEstiloCatalogo();
  return TEMAS_CATALOGO[estilo] !== undefined;
}
