import { palette, type ColorPrimitivo } from '../tokens/colors';
import { radius, radiusRedondeado } from '../tokens/radius';
import { familias, familiasTemporada } from '../tokens/typography';
import type { ColorToken, Fuentes, Theme } from '../types';
import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';

/** Las fuentes por nombre: uno de los tres estilos de la app o una combinación de temporada */
const TIPOGRAFIAS = { ...familias, ...familiasTemporada };
export type NombreTipografia = keyof typeof TIPOGRAFIAS;

/** Las esquinas: las de siempre o más redondeadas */
const RADIOS = { normales: radius, redondeados: radiusRedondeado };
export type NombreRadios = keyof typeof RADIOS;

/**
 * Un tema de temporada (Navidad…): los mismos nombres semánticos que lightTheme y darkTheme, con otros colores, otras
 * fuentes y, si quiere, esquinas más redondeadas. Se aplica con `TemaAnidado` solo donde hace falta (la web pública):
 * adentro, los atoms se pintan solos. Lo que no cambia (espaciados, tamaños) es el de siempre
 */
export interface TemaTemporada {
  claro: Theme['colors'];
  oscuro: Theme['colors'];
  fuentes: Fuentes;
  radius: Theme['radius'];
}

export interface DefinicionTemporada {
  /** Los semánticos que cambian, por nombre de primitivo (tokens/colors.ts). Los demás quedan como en el modo */
  claro: Partial<Record<ColorToken, ColorPrimitivo>>;
  oscuro: Partial<Record<ColorToken, ColorPrimitivo>>;
  /** Uno de los tres estilos de la app o una combinación de `familiasTemporada` (tokens/typography.ts) */
  tipografia: NombreTipografia;
  /** Por defecto, las de siempre */
  radios?: NombreRadios;
}

function resolver(base: Theme['colors'], cambios: Partial<Record<ColorToken, ColorPrimitivo>>): Theme['colors'] {
  const colores = { ...base };
  for (const [token, primitivo] of Object.entries(cambios) as [ColorToken, ColorPrimitivo][]) {
    colores[token] = palette[primitivo];
  }
  return colores;
}

/** Arma un tema de temporada a partir de los nombres de sus primitivos, su tipografía y sus radios */
export function crearTemaTemporada({ claro, oscuro, tipografia, radios = 'normales' }: DefinicionTemporada): TemaTemporada {
  return {
    claro: resolver(lightTheme.colors, claro),
    oscuro: resolver(darkTheme.colors, oscuro),
    fuentes: TIPOGRAFIAS[tipografia],
    radius: RADIOS[radios],
  };
}
