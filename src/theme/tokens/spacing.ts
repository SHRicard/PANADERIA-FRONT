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
  // Formularios (login, recuperar contraseña): 90% del ancho en el celular, centrado, con tope en pantallas anchas
  formWidth: '90%',
  formMax: 440,
  // Ancho máximo del contenido en pantallas anchas (la web abierta en una compu)
  contentMax: 960,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
} as const;
