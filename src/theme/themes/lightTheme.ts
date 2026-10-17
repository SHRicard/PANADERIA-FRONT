import { palette } from '../tokens/colors';
import { base, type TemaSinTipografia } from './base';

export const lightTheme: TemaSinTipografia = {
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
    successStrong: palette.verde700,
    successStrongPressed: palette.verde800,
    onSuccess: palette.blanco,
    warning: palette.ambar700,
    warningSoft: palette.ambar50,
    danger: palette.rojo700,
    dangerSoft: palette.rojo50,
    shadow: palette.sombraTostada,
    overlay: palette.veloTostado,
  },
};
