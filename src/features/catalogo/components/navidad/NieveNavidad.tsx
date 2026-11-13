import { useBreakpoint } from '@/shared/hooks';
import { useTheme } from '@/theme';
import { Nieve } from './adornos';

/**
 * La nieve que cae en toda la web mientras el catálogo es de Navidad (el catálogo, el detalle y el pedido): detrás del
 * contenido de cada pantalla, nunca encima de un texto ni de una hoja abierta (ver `TemaCatalogo`). En la compu, más
 * copos. Con «reducir movimiento», quieta
 */
export function NieveNavidad() {
  const theme = useTheme();
  const enCompu = useBreakpoint() === 'compu';
  return <Nieve cantidad={enCompu ? theme.sizes.coposCompu : theme.sizes.copos} contorno />;
}
