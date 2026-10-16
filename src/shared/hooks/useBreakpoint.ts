import { useWindowDimensions } from 'react-native';
import { useTheme } from '@/theme';

export type Breakpoint = 'celular' | 'tableta' | 'compu';

/**
 * En qué ancho de ventana se está: la web cambia los números (columnas, márgenes), no el árbol.
 * Durante el prerender de la web el ancho llega en 0: sale como celular y se ajusta al hidratar
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  const { sizes } = useTheme();
  if (width >= sizes.anchoCompu) return 'compu';
  if (width >= sizes.anchoTableta) return 'tableta';
  return 'celular';
}
