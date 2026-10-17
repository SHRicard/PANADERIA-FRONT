// Recomendaciones de ejemplo para autocompletar lo que escribe el cliente al votar un producto.
// Genéricas: no nombran ingredientes ni tipos de producto, así sirven para cualquiera (una tarta, un pan, un chipá)

/** 100 frases cortas y distintas, como las dejaría un cliente. Todas entran en el tope del back (300 caracteres) */
export const RECOMENDACIONES_SUGERIDAS: readonly string[] = [
  // El sabor
  '¡Súper rico!',
  'Riquísimo, de verdad.',
  'Una delicia.',
  'Espectacular, me encantó.',
  'Tiene un sabor increíble.',
  'El sabor es casero de verdad.',
  'Se nota que está hecho con amor.',
  'Exquisito, no le cambiaría nada.',
  'De lo más rico que probé.',
  'Sabroso y bien fresquito.',
  'Tiene el sabor justo.',
  'Mejor de lo que esperaba.',
  'Una maravilla, se me hizo agua la boca.',
  'Rico, rico, rico.',
  'Muy sabroso, y se nota la calidad.',
  'Un manjar.',
  'Tiene gusto a hecho en casa.',
  'Delicioso de principio a fin.',
  'Me sorprendió para bien.',
  'Increíble, superó mis expectativas.',

  // Volver a comprar
  '100% recomendable, ya lo compré varias veces.',
  'Lo volvería a pedir sin dudarlo.',
  'Ya es un clásico en casa.',
  'Es la tercera vez que lo pido y siempre igual de rico.',
  'No puede faltar en mi pedido.',
  'Ya lo pedí de nuevo.',
  'Cliente fiel desde que lo probé.',
  'Cada vez que pido, sumo este.',
  'Lo compro todas las semanas.',
  'Repetiría mil veces.',
  'Me hice fan.',
  'Ya quiero volver a pedir.',
  'Desde que lo probé, no compro en otro lado.',
  'Mi favorito de la casa.',
  'Lo pido cada vez que puedo.',

  // Para compartir
  'En casa voló en minutos.',
  'A toda la familia le encantó.',
  'Lo llevé a una reunión y fue un éxito.',
  'Mis hijos lo aman.',
  'Ideal para compartir.',
  'Perfecto para el mate de la tarde.',
  'Ideal para acompañar un café.',
  'Lo llevé a un cumple y no quedó nada.',
  'Todos me preguntaron dónde lo compré.',
  'Lo regalé y fue un golazo.',
  'Para la merienda, lo mejor.',
  'Mis amigos quedaron encantados.',
  'Fue lo primero que se terminó en la mesa.',
  'Un éxito en el desayuno del domingo.',
  'Nos peleamos por el último pedazo.',

  // La calidad
  'Fresquito y bien hecho.',
  'Se nota la calidad de los ingredientes.',
  'Llegó perfecto y fresquito.',
  'Hecho con dedicación, se nota.',
  'Calidad de primera.',
  'Artesanal de verdad.',
  'Muy prolijo y bien presentado.',
  'Ingredientes de calidad: se siente en cada bocado.',
  'Tal cual como en la foto.',
  'Mejor que en la foto.',
  'Todo impecable.',
  'Muy bien hecho, con cuidado en cada detalle.',
  'La textura es perfecta.',
  'Se mantuvo fresco varios días.',
  'Nada que ver con los de supermercado.',

  // El precio y el tamaño
  'Excelente relación precio-calidad.',
  'Vale cada peso.',
  'Buena porción, rinde un montón.',
  'Rinde muchísimo.',
  'Muy buen precio para lo que es.',
  'Generoso en tamaño y en sabor.',
  'Lo vale totalmente.',

  // La atención
  'La atención, un diez.',
  'Muy buena atención y todo riquísimo.',
  'Me lo tuvieron a tiempo y perfecto.',
  'Súper amables, y el producto, buenísimo.',
  'Cumplieron con todo lo que pedí.',
  'Se nota el cariño en lo que hacen.',
  'Un placer comprarles.',
  'Gracias por tanto sabor.',

  // Cortitas
  '¡Lo más!',
  '¡Diez puntos!',
  '¡Un golazo!',
  '¡Excelente!',
  '¡Buenísimo!',
  '¡Me encantó!',
  '¡Una locura de rico!',
  '¡Imperdible!',
  '¡Increíble!',
  '¡Recomendadísimo!',
  '¡Es mi ganador!',
  '¡Cinco estrellas!',

  // Para los que todavía no lo probaron
  'Si dudás, pedilo.',
  'Probalo, no te vas a arrepentir.',
  'Se los recomiendo a todos.',
  'Lo recomiendo con los ojos cerrados.',
  'Tienen que probarlo sí o sí.',
  'Si no lo probaste, te estás perdiendo algo.',
  'Una compra que no falla.',
  'De esas cosas que te alegran el día.',
];

// Para comparar sin mayúsculas, acentos ni los signos de apertura: «rico» encuentra «¡Súper rico!»
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¡¿]/g, '')
    .toLocaleLowerCase('es-AR')
    .trim();

/**
 * Las recomendaciones que coinciden con lo que va escribiendo el cliente, para el autocompletado: primero las
 * que empiezan así y después las que lo tienen en el medio. Sin nada escrito, no sugiere nada
 */
export function sugerirRecomendaciones(texto: string, max = 5): string[] {
  const buscado = normalizar(texto);
  if (!buscado) return [];
  const empiezan: string[] = [];
  const contienen: string[] = [];
  for (const recomendacion of RECOMENDACIONES_SUGERIDAS) {
    const normalizada = normalizar(recomendacion);
    if (normalizada.startsWith(buscado)) empiezan.push(recomendacion);
    else if (normalizada.includes(buscado)) contienen.push(recomendacion);
  }
  return [...empiezan, ...contienen].slice(0, max);
}

/** Unas recomendaciones al azar, sin repetir las que ya se mostraron (para «Otras ideas») */
export function recomendacionesAlAzar(cantidad = 5, excluir: readonly string[] = []): string[] {
  const disponibles = RECOMENDACIONES_SUGERIDAS.filter((recomendacion) => !excluir.includes(recomendacion));
  // Fisher-Yates: todas tienen la misma chance
  for (let i = disponibles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
  }
  return disponibles.slice(0, cantidad);
}
