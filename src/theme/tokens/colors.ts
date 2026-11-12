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

  // La galletita del alfajor que pasa por la vidriera del loader: más clara que la miga en claro, más apagada en oscuro
  galleta200: '#EED3A1',
  galleta400: '#C99A62',

  // Las dos series de los gráficos en el modo oscuro: más apagadas que corteza y manteca, que ahí no se distinguen
  teja600: '#9F5226',
  miel600: '#BB8C2A',

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
  // El brillo de arriba del pan de la vidriera (el loader): en oscuro, más tenue para que no encandile
  brilloBlanco: 'rgba(255, 255, 255, 0.55)',
  brilloTenue: 'rgba(255, 255, 255, 0.35)',

  // ── Navidad (el catálogo de temporada, docs/catalogo-navidad.md). Los usan solo los temas de temporada; los
  // adornos (nieve, cinta, pino, lo destacado) también tienen un valor en los temas de la app, para Diseño del
  // sistema. Los colores salen del logo de Navidad: el verde pino, el crema, el rojo del bastón y el dorado del aro ──

  // Navidad de día: crema con el verde del logo, rojo y dorado. De noche, un oscuro cálido neutro (cacao casi negro): el verde queda solo en la guirnalda
  guirnaldaCrema: '#FBF6EC',
  guirnaldaApagado: '#F3EBDC',
  guirnaldaBorde: '#E8DCC6',
  chocolate: '#3A1608',
  chocolateSuave: '#6E5646',
  rojoNavidad: '#C21F2B',
  rojoNavidadPresionado: '#9E1822',
  rojoNavidadSuave: '#FBE6E4',
  doradoAro: '#D7A63B',
  pinoLogo: '#1F5A36',
  pinoLogoOscuro: '#163F26',
  luzAzul: '#2F6FD6',
  sombraChocolate: 'rgba(58, 22, 8, 0.12)',
  guirnaldaNoche: '#15110E',
  guirnaldaNocheSuperficie: '#1F1A16',
  guirnaldaNocheApagado: '#29231E',
  guirnaldaNocheBorde: '#3B332C',
  guirnaldaNocheTinta: '#F7EEDC',
  guirnaldaNocheTintaSuave: '#C8BDB0',
  rojoNavidadNoche: '#F0656B',
  rojoNavidadNochePresionado: '#DB5157',
  rojoNavidadNocheSuave: '#3A1E1F',
  rojoNavidadNocheTinta: '#2A0A0C',
  doradoNoche: '#E6C06A',
  doradoNocheTinta: '#2A1A05',
  pinoNoche: '#7CC796',
  pinoNocheOscuro: '#2F6E45',
  luzAzulNoche: '#6EA8FF',
  // La guirnalda de la Navidad de día: oropel en los dorados de la app (bronce y champán) en vez del pino verde, y un
  // foquito cobre en vez del azul. De noche, un poco más claros
  oropelBronce: '#A8743A',
  oropelChampan: '#E2C27D',
  luzCobre: '#E07A5F',
  oropelBronceNoche: '#8A5E2E',
  oropelChampanNoche: '#E8CB8A',
  luzCobreNoche: '#F0957C',
  // La vidriera de la cabecera: cacao cálido, como iluminada desde adentro, más profundo hacia los bordes (el tono de la
  // app; antes era verde pino y no combinaba con las tarjetas)
  vidriera: '#4A2A1C',
  vidrieraProfunda: '#1A0F0A',

  // Navidad de noche: el cielo azul con nieve, sobre una página blanca fría. De noche, todo azul noche
  // El contorno de los copos: sobre claro, un marrón suave; sobre oscuro no hace falta
  contornoNieveClaro: 'rgba(110, 86, 70, 0.55)',
  contornoNieveOscuro: 'rgba(0, 0, 0, 0)',
  nieveFria: '#F3F7FB',
  nieveFriaApagado: '#E5EDF5',
  nieveFriaBorde: '#D3DFEA',
  azulNoche: '#15203B',
  azulNocheSuave: '#4C5A70',
  // El cielo: el horizonte y lo alto (en claro y en oscuro)
  cieloHorizonte: '#22386E',
  cieloCenit: '#0A1230',
  cieloHorizonteNoche: '#1E3164',
  cieloCenitNoche: '#060C22',
  rojoEscena: '#C9293A',
  rojoEscenaPresionado: '#A62230',
  rojoEscenaSuave: '#FBE6E7',
  mostazaEscena: '#F2B544',
  pinoEscena: '#2C7A4E',
  pinoEscenaOscuro: '#1E5536',
  luzAzulEscena: '#5B9BFF',
  crema: '#F6F1E6',
  sombraAzul: 'rgba(21, 32, 59, 0.12)',
  escenaNoche: '#0E1526',
  escenaNocheSuperficie: '#172138',
  escenaNocheApagado: '#1F2B45',
  escenaNocheBorde: '#2C3A57',
  escenaNocheTinta: '#EEF2F8',
  escenaNocheTintaSuave: '#A9B4C7',
  rojoEscenaNoche: '#FF6B72',
  rojoEscenaNochePresionado: '#F0575E',
  rojoEscenaNocheSuave: '#3A1E26',
  rojoEscenaNocheTinta: '#2A0A0D',
  mostazaEscenaNoche: '#F5C25E',
  mostazaEscenaNocheTinta: '#241604',
  pinoEscenaNoche: '#74C995',
  luzAzulEscenaNoche: '#7FB2FF',

  // La luz dorada de la tarjeta de un producto en la Navidad de día, prendida en la esquina de arriba
  resplandorDorado: 'rgba(201, 151, 46, 0.34)',
  resplandorDoradoNoche: 'rgba(232, 191, 99, 0.3)',
} as const;

/** El nombre de un primitivo: los temas de temporada eligen sus colores por nombre, sin repetir el valor */
export type ColorPrimitivo = keyof typeof palette;
