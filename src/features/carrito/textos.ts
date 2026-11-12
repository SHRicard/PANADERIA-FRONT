/** Lo que cambia en el pedido mientras la web está de Navidad (`useEsNavidad`, de catalogo) */
export const TEXTOS_PEDIDO_NAVIDAD = {
  /** La barra de abajo del catálogo y del detalle */
  barra: 'Tu pedido de fiestas',
  /** La línea chica dorada arriba del título */
  temporada: 'Para tu mesa de fiestas',
  bajada: 'Revisá lo que elegiste, mirá la seña y dejanos tus datos. Los precios son los de hoy.',
  vacio: {
    titulo: 'Tu pedido de fiestas está vacío',
    texto: 'Elegí lo que gustes para la mesa navideña con el «+» de cada producto.',
  },
  confirmado: {
    temporada: '¡Felices fiestas!',
    lista: 'Lo que pediste',
    despedida: '¡Que pases unas muy felices fiestas!',
    texto: 'Gracias por elegirnos para tu mesa de fiestas. Te vamos a contactar al teléfono que dejaste para coordinar la seña y la entrega.',
  },
} as const;
