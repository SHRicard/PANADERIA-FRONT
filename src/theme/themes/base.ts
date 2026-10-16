import { radius } from '../tokens/radius';
import { iconSize, iconStroke, opacity, sizes, spacing } from '../tokens/spacing';
import { familias, fontSize, letterSpacing, lineHeight } from '../tokens/typography';
import type { EstiloTipografia, Theme, TipografiaTema } from '../types';

/** Lo que define cada modo: claro u oscuro. La tipografía la suma el ThemeProvider */
export type TemaSinTipografia = Omit<Theme, keyof TipografiaTema>;

// Lo que no cambia entre claro y oscuro: las escalas
export const base: Omit<TemaSinTipografia, 'mode' | 'colors'> = {
  spacing,
  radius,
  sizes,
  iconSize,
  iconStroke,
  opacity,
};

/**
 * Variantes de texto con las fuentes de un estilo. La fuente de título va solo en las variantes
 * de 22 px para arriba (la Cormorant de «delicada» es muy fina para menos); el resto, con la de texto.
 */
export function crearTipografia(estilo: EstiloTipografia): TipografiaTema {
  const fuentes = familias[estilo];
  return {
    fonts: fuentes,
    text: {
      hero: { fontSize: fontSize.hero, lineHeight: lineHeight.hero, fontFamily: fuentes.titulo },
      display: { fontSize: fontSize.xxxl, lineHeight: lineHeight.xxxl, fontFamily: fuentes.titulo },
      heading: { fontSize: fontSize.xxl, lineHeight: lineHeight.xxl, fontFamily: fuentes.titulo },
      title: { fontSize: fontSize.xl, lineHeight: lineHeight.xl, fontFamily: fuentes.titulo },
      subtitle: { fontSize: fontSize.lg, lineHeight: lineHeight.lg, fontFamily: fuentes.textoNegrita },
      body: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontFamily: fuentes.texto },
      bodyStrong: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontFamily: fuentes.textoNegrita },
      label: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontFamily: fuentes.textoMedio },
      caption: { fontSize: fontSize.xs, lineHeight: lineHeight.xs, fontFamily: fuentes.texto },
      // Una línea corta en mayúsculas arriba de un título (la fecha en el encabezado de las pestañas)
      overline: {
        fontSize: fontSize.xs,
        lineHeight: lineHeight.xs,
        fontFamily: fuentes.textoNegrita,
        letterSpacing: letterSpacing.amplio,
        textTransform: 'uppercase',
      },
    },
  };
}
