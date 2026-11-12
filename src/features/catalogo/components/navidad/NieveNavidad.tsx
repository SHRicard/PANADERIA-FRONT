import { useBreakpoint } from '@/shared/hooks';
import { useTheme } from '@/theme';
import { Nieve } from './adornos';

/**
 * La nieve que cae sobre toda la web mientras el catálogo es de Navidad: encima de las pantallas (el catálogo, el
 * detalle y el pedido), sin tapar los toques. En la compu, más copos. Con «reducir movimiento», quieta
 */
export function NieveNavidad() {
  const theme = useTheme();
  const enCompu = useBreakpoint() === 'compu';
  return <Nieve cantidad={enCompu ? theme.sizes.coposCompu : theme.sizes.copos} contorno />;
}
