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
    texto: 'Gracias por elegirnos para tu mesa de fiestas. Para confirmarlo, pagá la seña acá abajo: con la seña empezamos a prepararlo.',
  },
} as const;

/**
 * Debajo de «¡Recibimos tu pedido!»: una sola instrucción, la misma que sigue abajo («Pagá la seña»). Cómo lo recibe y
 * que le avisamos por WhatsApp van en su propio bloque
 */
export const TEXTO_CONFIRMADO = 'Para confirmarlo, pagá la seña acá abajo: con la seña empezamos a prepararlo.';

/** Debajo de «Confirmar pedido»: qué pasa después, coherente con la pantalla de confirmado */
export const TEXTO_ANTES_DE_CONFIRMAR = 'Después de confirmar te mostramos cómo pagar la seña.';
