// Escala base 4: nunca números sueltos en los componentes
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const sizes = {
  // Alto de los controles tocables (botones, inputs). 44 es el mínimo accesible
  touchMin: 44,
  control: 48,
  // Logo de Dama Blanca en los encabezados (login, recuperar contraseña)
  logo: 200,
  // El logo en el encabezado de las pestañas: chico al lado de la fecha (y en la barra que aparece al bajar),
  // mediano arriba del título centrado
  logoMini: 28,
  logoMedio: 56,
  // El ícono de la pestaña en un círculo (encabezado «Con ícono»), y más chico en la barra que aparece al bajar
  iconoPestana: 52,
  iconoPestanaChico: 36,
  // Fotos de productos: miniatura en las listas y casilla del selector de fotos
  miniatura: 64,
  foto: 96,
  // Formularios (login, recuperar contraseña): 90% del ancho en el celular, centrado, con tope en pantallas anchas
  formWidth: '90%',
  formMax: 440,
  // Ancho máximo del contenido en pantallas anchas (la web abierta en una compu)
  contentMax: 960,
  // Hoja que sube desde abajo (el select): alto tope y la manija de arriba
  hojaMax: '80%',
  manijaAncho: 36,
  manijaAlto: 4,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// Grosor del trazo de los íconos. La pestaña activa de la barra lo engrosa: en íconos de líneas sueltas
// (el de Más) es lo que se nota, porque no tienen nada que rellenar
export const iconStroke = {
  fino: 1.8,
  normal: 2,
  grueso: 2.2,
} as const;

export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
  // El relleno de un ícono: translúcido, así no tapa el dibujo de adentro (el croissant, las rayitas de Pedidos)
  relleno: 0.3,
} as const;
