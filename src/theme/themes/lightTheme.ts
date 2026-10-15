import { palette } from '../tokens/colors';
import type { Theme } from '../types';
import { base } from './base';

export const lightTheme: Theme = {
  ...base,
  mode: 'light',
  colors: {
    background: palette.crema50,
    surface: palette.blanco,
    surfaceMuted: palette.crema200,
    border: palette.crema300,
    text: palette.tostado900,
    textMuted: palette.tostado600,
    primary: palette.corteza600,
    primaryPressed: palette.corteza700,
    onPrimary: palette.blanco,
    primarySoft: palette.crema100,
    accent: palette.manteca400,
    onAccent: palette.tostado900,
    success: palette.verde700,
    successSoft: palette.verde50,
    warning: palette.ambar700,
    warningSoft: palette.ambar50,
    danger: palette.rojo700,
    dangerSoft: palette.rojo50,
  },
};
