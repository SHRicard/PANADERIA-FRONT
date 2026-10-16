import type { TextStyle } from 'react-native';
import type { radius } from './tokens/radius';
import type { iconSize, iconStroke, opacity, sizes, spacing } from './tokens/spacing';

// Semánticos: lo que usan los componentes. lightTheme y darkTheme tienen que definir todos
export type ColorToken =
  | 'background'
  | 'surface'
  | 'surfaceMuted'
  | 'border'
  | 'text'
  | 'textMuted'
  | 'primary'
  | 'primaryPressed'
  | 'onPrimary'
  | 'primarySoft'
  | 'accent'
  | 'onAccent'
  | 'success'
  | 'successSoft'
  | 'warning'
  | 'warningSoft'
  | 'danger'
  | 'dangerSoft'
  | 'shadow'
  | 'overlay';

export type TextVariant =
  | 'hero'
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'overline';

export type ModoTema = 'light' | 'dark';

/** Las tres combinaciones de fuentes. El dueño elige la suya en Más → Preferencias */
export type EstiloTipografia = 'clasica' | 'artesanal' | 'delicada';

/** Las fuentes de un estilo. El peso ya va en el nombre: nunca se combinan con fontWeight */
export interface Fuentes {
  /** Títulos grandes, nombre de la panadería y del producto. Solo de 22 px para arriba */
  titulo: string;
  /** Variante más liviana del título */
  tituloSuave: string;
  /** Descripciones, ingredientes, formularios */
  texto: string;
  textoMedio: string;
  /** Botones, precios, lo que se destaca en un texto */
  textoNegrita: string;
}

/** La parte del theme que sale del estilo de tipografía elegido (el resto, del modo claro u oscuro) */
export interface TipografiaTema {
  fonts: Fuentes;
  text: Record<TextVariant, Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontFamily' | 'letterSpacing' | 'textTransform'>>;
}

export interface Theme extends TipografiaTema {
  mode: ModoTema;
  colors: Record<ColorToken, string>;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  iconSize: typeof iconSize;
  iconStroke: typeof iconStroke;
  opacity: typeof opacity;
}
