export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// Los mismos nombres, más redondeados: los usa un tema de temporada que quiere esquinas más blandas (el catálogo de
// Navidad). Adentro de ese tema, los botones, los campos y las fotos se redondean solos
export const radiusRedondeado = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const satisfies Record<keyof typeof radius, number>;
