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
  // El dorado para TEXTO sobre el fondo claro: `accent` pinta estrellas y botones, pero como letra no llega al
  // contraste AA (4,5). En los temas que lo tienen oscuro de sobra, es el mismo `accent`
  | 'accentText'
  | 'success'
  | 'successSoft'
  // El botón verde (WhatsApp): relleno con texto blanco, oscuro en los dos modos para que el blanco se lea
  | 'successStrong'
  | 'successStrongPressed'
  | 'onSuccess'
  | 'warning'
  | 'warningSoft'
  | 'danger'
  | 'dangerSoft'
  // Las dos series de un gráfico (lo que entró y lo que salió, web y a mano). Se distinguen también sin color
  | 'grafico1'
  | 'grafico2'
  // La vidriera del loader (atom Cargando): la miga dorada, los cortes y contornos, el brillo del pan y la galletita
  // del alfajor
  | 'pan'
  | 'panCorte'
  | 'panBrillo'
  | 'panGalleta'
  // El catálogo de Navidad: los copos de nieve y las rayas claras del bastón, el rojo del bastón y de las luces, las
  // agujas de la guirnalda (dos verdes) y la luz azul. Las luces alternan cinta, accent, luzAzul y pino
  | 'nieve'
  // El contorno de cada copo de nieve: en claro, para que la nieve blanca se vea sobre el fondo; en oscuro, nada
  | 'contornoNieve'
  | 'cinta'
  | 'pino'
  | 'pinoOscuro'
  | 'luzAzul'
  // Una banda de color de temporada (la vidriera, el cielo), su tono más profundo (hacia los bordes, lo
  // alto del cielo) y lo que va encima
  | 'destacado'
  | 'destacadoProfundo'
  | 'onDestacado'
  // La luz dorada de la tarjeta de un producto en el catálogo de Navidad de día
  | 'resplandor'
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

// Queda solo la que eligió el dueño (docs/TIPOGRAFIAS.md, paso 6): las otras se desinstalaron para que la app pese
// menos y arranque antes. Para probar otra, se vuelve a sumar acá, en `familias` y su paquete
export type EstiloTipografia = 'clasica';

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
  // Los mismos nombres, con los valores que traiga el tema: uno de temporada puede redondear más (radiusRedondeado)
  radius: Record<keyof typeof radius, number>;
  sizes: typeof sizes;
  iconSize: typeof iconSize;
  iconStroke: typeof iconStroke;
  opacity: typeof opacity;
}
