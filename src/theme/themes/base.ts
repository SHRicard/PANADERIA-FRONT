import { radius } from '../tokens/radius';
import { iconSize, opacity, sizes, spacing } from '../tokens/spacing';
import { fontSize, fontWeight, lineHeight } from '../tokens/typography';
import type { Theme } from '../types';

// Lo que no cambia entre claro y oscuro: escalas y variantes de texto
export const base: Omit<Theme, 'mode' | 'colors'> = {
  text: {
    display: { fontSize: fontSize.xxxl, lineHeight: lineHeight.xxxl, fontWeight: fontWeight.bold },
    heading: { fontSize: fontSize.xxl, lineHeight: lineHeight.xxl, fontWeight: fontWeight.bold },
    title: { fontSize: fontSize.xl, lineHeight: lineHeight.xl, fontWeight: fontWeight.bold },
    subtitle: { fontSize: fontSize.lg, lineHeight: lineHeight.lg, fontWeight: fontWeight.semibold },
    body: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontWeight: fontWeight.regular },
    bodyStrong: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontWeight: fontWeight.semibold },
    label: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: fontWeight.medium },
    caption: { fontSize: fontSize.xs, lineHeight: lineHeight.xs, fontWeight: fontWeight.regular },
  },
  spacing,
  radius,
  sizes,
  iconSize,
  opacity,
};
