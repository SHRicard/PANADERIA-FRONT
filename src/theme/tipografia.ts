import { useFonts } from 'expo-font';
// Cada peso se importa de su carpeta: el índice del paquete trae todos y la app cargaría fuentes que no usa
import { Lato_400Regular } from '@expo-google-fonts/lato/400Regular';
import { Lato_700Bold } from '@expo-google-fonts/lato/700Bold';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display/500Medium';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import type { NombreFuente } from './tokens/typography';
import type { EstiloTipografia } from './types';

export interface InfoTipografia {
  estilo: EstiloTipografia;
  nombre: string;
  descripcion: string;
}

/** Cómo se presenta cada estilo al elegirlo (Más → Preferencias y Diseño del sistema) */
export const ESTILOS_TIPOGRAFIA: Record<EstiloTipografia, InfoTipografia> = {
  clasica: {
    estilo: 'clasica',
    nombre: 'Clásica',
    descripcion: 'Playfair Display y Lato: tiene aire de pastelería fina.',
  },
};

// Las del estilo y las de temporada (Nunito, para la web de Navidad). El tipo obliga a que estén todas las que se usan
// y ninguna de más: cada fuente de más es peso en la APK y espera en la splash
const FUENTES: Record<NombreFuente, number> = {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  Lato_400Regular,
  Lato_700Bold,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
};

/**
 * Carga las fuentes al arrancar. Devuelve true cuando terminó, bien o mal:
 * si falla, la app sigue con la letra del sistema.
 */
export function useCargarFuentes(): boolean {
  const [cargadas, error] = useFonts(FUENTES);
  return cargadas || error !== null;
}
