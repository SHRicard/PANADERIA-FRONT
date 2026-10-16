import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Un fondo con degradado (ej.: `linear-gradient(to right, dorado, transparent)`). En el celular lo dibuja
 * React Native con `experimental_backgroundImage`; la web no conoce esa prop y va con el CSS de siempre
 */
export function fondoDegradado(degradado: string): ViewStyle {
  return Platform.OS === 'web'
    ? // backgroundImage no está en los tipos de React Native, pero react-native-web lo pasa tal cual al CSS
      ({ backgroundImage: degradado } as unknown as ViewStyle)
    : { experimental_backgroundImage: degradado };
}


/**
 * Sin el recuadro que el navegador dibuja alrededor de un campo con foco: el borde del Input ya lo marca.
 * Hace falta `outline-style: none`: Chrome dibuja su recuadro automático aunque el ancho sea 0
 */
export function sinContornoDeFoco(): TextStyle {
  return Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : {};
}
