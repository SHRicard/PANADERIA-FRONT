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
  // El logo en la barra de arriba de la web
  logoChico: 40,
  // El ícono de la pestaña en un círculo (encabezado «Con ícono»), y más chico en la barra que aparece al bajar
  iconoPestana: 52,
  iconoPestanaChico: 36,
  // Fotos de productos: miniatura en las listas y casilla del selector de fotos
  miniatura: 64,
  foto: 96,
  // La foto de cada producto en la carta de la web: más grande que en las listas, que es lo que tienta
  fotoCarta: 88,
  fotoCartaGrande: 120,
  // Formularios (login, recuperar contraseña): 90% del ancho en el celular, centrado, con tope en pantallas anchas
  formWidth: '90%',
  formMax: 440,
  // Ancho máximo del contenido en pantallas anchas (la web abierta en una compu)
  contentMax: 960,
  // La carta del catálogo: en la tableta, una columna de hasta 780; en la compu, el 80% de la ventana
  cartaMax: 780,
  cartaCompu: '80%',
  // La foto del detalle de un producto: en la compu no pasa de acá (al ancho de la carta quedaba más alta que la pantalla)
  fotoDetalleMax: 520,
  // El buscador de la bienvenida en la compu: no cruza todo el ancho
  buscadorMax: 560,
  // Desde qué ancho de ventana la web pasa a tableta y a compu (cambian los números, no el árbol)
  anchoTableta: 600,
  anchoCompu: 900,
  // Hoja que sube desde abajo (el select): alto tope y la manija de arriba
  hojaMax: '80%',
  manijaAncho: 36,
  manijaAlto: 4,
  // El numerito sobre un botón (cuántos filtros hay puestos)
  insignia: 20,
  // Alto de los gráficos de Métricas: el del balance, el de los días de la semana y el mini de una fila
  grafico: 160,
  graficoChico: 96,
  graficoMini: 28,
  // El ancho de la vidriera del loader (es tres veces más ancha que alta): la que ocupa el lugar de lo que carga, y la
  // que va en una línea (adentro de un botón, «Cargando más pedidos»)
  vidriera: 180,
  vidrieraChico: 54,
  // El dibujo del cartel de negocio cerrado (el frente del local): hasta acá crece, también en la compu
  cartelCerrado: 340,
  // El catálogo de Navidad (docs/catalogo-navidad.md): el logo, en la barra de arriba
  logoNavidad: 60,
  // El regalo que hace de carrito
  regaloCarrito: 42,
  // La guirnalda de pino: su alto y cada cuánto lleva un foquito; el foquito (ancho y alto), su casquillo y el halo de
  // luz que lo rodea
  guirnalda: 38,
  pasoFoquito: 24,
  foquito: 9,
  foquitoLargo: 13,
  casquilloFoquito: 5,
  haloFoquito: 26,
  // Lo que cuelga (esferas, campanas): chico y grande
  colgante: 40,
  colganteGrande: 58,
  // Los destellos (✦) y las luces desenfocadas del fondo, chicas y grandes; la aurora del cielo
  destello: 14,
  destelloGrande: 22,
  bokeh: 36,
  bokehGrande: 110,
  aurora: 300,
  // Cuánto sube algo que flota o se levanta (una tarjeta con el mouse encima)
  flotar: 8,
  // Los personajes parados en la nieve (en la compu, más grandes), los del fondo y la loma
  personajeEscena: 72,
  personajeEscenaCompu: 104,
  personajeLejano: 46,
  loma: 44,
  // El dibujo al lado del título de una sección, el del catálogo vacío y el del pie
  mascota: 44,
  ilustracionVacio: 128,
  ilustracionPie: 76,
  // El patrón de dibujos del fondo: cada cuánto va un dibujo y su tamaño (en la compu, más separados y más grandes)
  patronPaso: 92,
  patronPasoCompu: 124,
  patronDibujo: 32,
  patronDibujoCompu: 42,
  // Los copos de nieve: de lejos, del medio y de cerca
  copoLejos: 2,
  copoMedio: 4,
  copoCerca: 7,
  // Los dibujos del saludo de la Navidad de día: los de los costados y el del medio (en la compu, más grandes)
  saludoDibujo: 56,
  saludoDibujoCentro: 84,
  saludoDibujoCompu: 76,
  saludoDibujoCentroCompu: 116,
  // El ancho del texto del saludo, para que se lea en renglones cómodos
  saludoTexto: 520,
  // La nieve que cae sobre toda la web de Navidad: cuántos copos (en la compu, más)
  copos: 40,
  coposCompu: 80,
  // La tarjeta de un producto en la Navidad de día: el dibujo de marca de agua que asoma por el borde derecho
  dibujoTarjeta: 104,
  // La escena de arriba del pedido de Navidad: los dibujos de los costados y la canasta del medio
  pedidoDibujo: 52,
  pedidoDibujoCentro: 108,
  // La escena de arriba del pedido confirmado (Navidad): los de los costados (Papá Noel, en el medio, va con
  // `ilustracionVacio`)
  confirmadoLado: 68,
  // Las galletitas de jengibre para votar en los catálogos de Navidad (en lugar de las estrellas)
  galletaPuntaje: 34,
  // La ramita de acebo prendida en la esquina de la foto grande del detalle (Navidad)
  aceboFoto: 64,
  // El regalo de adentro del botón dorado de Navidad (confirmar el pedido, agregar al pedido)
  regaloBoton: 26,
  // La ramita de acebo prendida en la etiqueta de un producto (catálogos de Navidad)
  aceboEtiqueta: 30,
} as const;

export const iconSize = {
  // Al lado de un texto chico (la estrellita del puntaje en el catálogo)
  xs: 12,
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
  none: 0,
  pressed: 0.85,
  disabled: 0.5,
  // El relleno de un ícono: translúcido, así no tapa el dibujo de adentro (el croissant, las rayitas de Pedidos)
  relleno: 0.3,
  // Los panes de la vidriera en el cartel de negocio cerrado: con la luz apagada
  apagado: 0.4,
  // La nieve del catálogo de Navidad: se ve sin tapar lo de abajo
  nieve: 0.75,
  // Las luces desenfocadas del fondo, la aurora y la loma de atrás
  bokeh: 0.28,
  aurora: 0.22,
  lejano: 0.45,
  // El patrón de dibujos del fondo: suave, como un papel de regalo (de noche, más todavía)
  patron: 0.26,
  patronNoche: 0.15,
  // Las estrellitas que titilan entre los dibujos del patrón de noche: cuando más brillan
  estrellaPatron: 0.75,
  // El dibujo de Navidad que asoma detrás de cada tarjeta: como una marca de agua, no tapa lo que se lee
  dibujoTarjeta: 0.32,
  // El brillo que cruza el botón de confirmar el pedido de Navidad
  brilloBoton: 0.55,
  // Las galletitas de votar que todavía no se eligieron (Navidad)
  galletaApagada: 0.3,
} as const;
