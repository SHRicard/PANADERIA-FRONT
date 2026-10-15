import { palette } from '../tokens/colors';
import { base, type TemaSinTipografia } from './base';

export const darkTheme: TemaSinTipografia = {
  ...base,
  mode: 'dark',
  colors: {
    background: palette.horno950,
    surface: palette.horno900,
    surfaceMuted: palette.horno800,
    border: palette.horno600,
    text: palette.tostado50,
    textMuted: palette.tostado300,
    primary: palette.corteza300,
    primaryPressed: palette.corteza400,
    onPrimary: palette.tostado900,
    primarySoft: palette.horno700,
    accent: palette.manteca300,
    onAccent: palette.tostado900,
    success: palette.verde300,
    successSoft: palette.verde900,
    warning: palette.ambar300,
    warningSoft: palette.ambar900,
    danger: palette.rojo300,
    dangerSoft: palette.rojo900,
    shadow: palette.sombraNegra,
    overlay: palette.veloNegro,
  },
};
