import type { EstiloTipografia, Fuentes } from '../types';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
  // El título grande de la web en la compu («¿Qué se te antoja hoy?»)
  hero: 52,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 34,
  xxxl: 40,
  hero: 60,
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
} as const satisfies Record<EstiloTipografia, Fuentes>;

// Las combinaciones de los temas de temporada (el catálogo de Navidad, docs/catalogo-navidad.md), además del estilo
// de la app
export const familiasTemporada = {
  // Toda en Nunito, redondeada como los dibujos; los títulos en negrita
  redondeada: {
    titulo: 'Nunito_700Bold',
    tituloSuave: 'Nunito_600SemiBold',
    texto: 'Nunito_400Regular',
    textoMedio: 'Nunito_600SemiBold',
    textoNegrita: 'Nunito_700Bold',
  },
} as const satisfies Record<string, Fuentes>;

/** El nombre de cada fuente que hay que cargar al arrancar: las del estilo y las de temporada */
export type NombreFuente =
  | (typeof familias)[EstiloTipografia][keyof Fuentes]
  | (typeof familiasTemporada)[keyof typeof familiasTemporada][keyof Fuentes];
