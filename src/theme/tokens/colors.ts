// Primitivos: la paleta cruda, nombrada por lo que ES. Los componentes nunca la usan directo:
// pasan por los semánticos de themes/. Cambiar de paleta es cambiar este archivo.
// Paleta "Medialuna": corteza tostada, manteca dorada y fondos crema.
export const palette = {
  blanco: '#FFFFFF',

  crema50: '#FBF7F0',
  crema100: '#F6E6CF',
  crema200: '#F3EBDD',
  crema300: '#E4D7C3',

  corteza300: '#E9A55A',
  corteza400: '#D38F45',
  corteza600: '#9A5B1E',
  corteza700: '#7E4914',

  manteca300: '#F0C063',
  manteca400: '#E2A93B',

  tostado50: '#F5EBDD',
  tostado300: '#BBA68E',
  tostado600: '#6E5A47',
  tostado900: '#2B1D12',

  horno600: '#3D3024',
  horno700: '#3A2A1A',
  horno800: '#2C2219',
  horno900: '#221A13',
  horno950: '#17110C',

  verde50: '#E5F2EA',
  verde300: '#6CC08A',
  verde700: '#2F7D4A',
  verde800: '#25643B',
  verde900: '#1C3324',

  ambar50: '#FBF0DC',
  ambar300: '#E2B05A',
  ambar700: '#A86A00',
  ambar900: '#3A2E17',

  rojo50: '#FBE9E7',
  rojo300: '#F2857B',
  rojo700: '#B3261E',
  rojo900: '#3A1E1B',

  // Sombras: el tostado con transparencia en claro; en oscuro, negro más cargado para que se note
  sombraTostada: 'rgba(43, 29, 18, 0.18)',
  sombraNegra: 'rgba(0, 0, 0, 0.5)',
  // Velos: oscurecen la pantalla detrás de una hoja que sube desde abajo (el select)
  veloTostado: 'rgba(43, 29, 18, 0.45)',
  veloNegro: 'rgba(0, 0, 0, 0.6)',
} as const;
