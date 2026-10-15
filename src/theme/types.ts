import type { TextStyle } from 'react-native';
import type { radius } from './tokens/radius';
import type { iconSize, opacity, sizes, spacing } from './tokens/spacing';

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
  | 'dangerSoft';

export type TextVariant = 'display' | 'heading' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'label' | 'caption';

export type ModoTema = 'light' | 'dark';

export interface Theme {
  mode: ModoTema;
  colors: Record<ColorToken, string>;
  text: Record<TextVariant, Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>>;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  iconSize: typeof iconSize;
  opacity: typeof opacity;
}
