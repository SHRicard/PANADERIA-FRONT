import type { TemaTemporada } from '@/theme';
import { TEMA_DIA_NAVIDAD } from './components/navidad/dia/tema';
import { TEMA_NOCHE_NAVIDAD } from './components/navidad/noche/tema';
import type { EstiloCatalogo } from './types';

/**
 * Los estilos de temporada traen su tema (colores y letras), que pinta toda la web pública: el catálogo, el detalle de
 * un producto y el pedido. Los de todo el año (vidriera, carta) no tienen: usan el de la app (docs/catalogo-navidad.md)
 */
export const TEMAS_CATALOGO: Partial<Record<EstiloCatalogo, TemaTemporada>> = {
  'dia-navidad': TEMA_DIA_NAVIDAD,
  'noche-navidad': TEMA_NOCHE_NAVIDAD,
};
