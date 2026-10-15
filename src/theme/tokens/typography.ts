import type { EstiloTipografia, Fuentes } from '../types';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 34,
  xxxl: 40,
} as const;

// Aire entre letras: solo para textos cortos en mayúsculas (la fecha arriba del título de cada pestaña)
export const letterSpacing = {
  amplio: 1.2,
} as const;

// Fuentes de Google Fonts (@expo-google-fonts), una combinación por estilo (docs/TIPOGRAFIAS.md).
// El peso va en el nombre: con una fuente propia no se usa fontWeight (en Android se ignora o se ve mal)
export const familias = {
  clasica: {
    titulo: 'PlayfairDisplay_700Bold',
    tituloSuave: 'PlayfairDisplay_500Medium',
    texto: 'Lato_400Regular',
    textoMedio: 'Lato_400Regular',
    textoNegrita: 'Lato_700Bold',
  },
  artesanal: {
    titulo: 'Fraunces_700Bold',
    tituloSuave: 'Fraunces_500Medium',
    texto: 'Nunito_400Regular',
    textoMedio: 'Nunito_600SemiBold',
    textoNegrita: 'Nunito_700Bold',
  },
  delicada: {
    titulo: 'CormorantGaramond_700Bold',
    tituloSuave: 'CormorantGaramond_500Medium',
    texto: 'Inter_400Regular',
    textoMedio: 'Inter_500Medium',
    textoNegrita: 'Inter_600SemiBold',
  },
} as const satisfies Record<EstiloTipografia, Fuentes>;

/** El nombre de cada fuente que hay que cargar al arrancar */
export type NombreFuente = (typeof familias)[EstiloTipografia][keyof Fuentes];
