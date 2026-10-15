import { useFonts } from 'expo-font';
// Cada peso se importa de su carpeta: el índice del paquete trae todos y la app cargaría fuentes que no usa
import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces/700Bold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
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
    descripcion: 'Playfair Display y Lato: se siente a pastelería fina.',
  },
  artesanal: {
    estilo: 'artesanal',
    nombre: 'Artesanal',
    descripcion: 'Fraunces y Nunito: casera y cálida.',
  },
  delicada: {
    estilo: 'delicada',
    nombre: 'Delicada',
    descripcion: 'Cormorant Garamond e Inter: elegante y sutil.',
  },
};

// Las de los tres estilos, para poder cambiar de uno a otro sin reiniciar. El tipo obliga a que
// estén todas las de `familias` y ninguna de más. Cuando el dueño elija, se borran las otras (docs/TIPOGRAFIAS.md, paso 6)
const FUENTES: Record<NombreFuente, number> = {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  Lato_400Regular,
  Lato_700Bold,
  Fraunces_500Medium,
  Fraunces_700Bold,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  CormorantGaramond_500Medium,
  CormorantGaramond_700Bold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
};

/**
 * Carga las fuentes al arrancar. Devuelve true cuando terminó, bien o mal:
 * si falla, la app sigue con la letra del sistema.
 */
export function useCargarFuentes(): boolean {
  const [cargadas, error] = useFonts(FUENTES);
  return cargadas || error !== null;
}
