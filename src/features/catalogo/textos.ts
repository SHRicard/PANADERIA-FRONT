// Cómo se leen los datos del producto en la web

/**
 * La vista previa del link (lo que muestra WhatsApp al compartir la web: la imagen, el título y la descripción). Es la
 * misma para todas las URLs: los productos se cargan en el navegador, así que el HTML no sabe cuál es
 */
export const VISTA_PREVIA = {
  titulo: 'Dama Blanca · Horneados',
  descripcion: 'El catálogo de Dama Blanca: mirá todo lo que horneamos, con sus precios, y hacé tu pedido online.',
  marca: 'Dama Blanca',
  // En public/: la web la sirve en la raíz. 1200 × 630, la medida que WhatsApp muestra grande; el logo va centrado
  // para que se vea entero también cuando la recorta en cuadrado
  imagen: '/vista-previa.png',
  imagenAncho: 1200,
  imagenAlto: 630,
  imagenTexto: 'El logo de Dama Blanca Horneados',
} as const;

/**
 * El título de una sección de la carta: el nombre del tipo. Los que no tienen tipo van al final, como «Otros»; si
 * son los únicos (el dueño todavía no usa tipos), no son «otros» de nada: `siEsUnica` (un estilo de temporada trae el suyo)
 */
export function tituloSeccion(tipo: { nombre: string } | null, unica: boolean, siEsUnica = 'Nuestros productos'): string {
  if (tipo) return tipo.nombre;
  return unica ? siEsUnica : 'Otros';
}

/** El saludo de la bienvenida según la hora del cliente */
export function saludoSegunHora(hora: number): string {
  if (hora >= 6 && hora < 13) return 'Buen día';
  if (hora >= 13 && hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

/** 900 → "900 g"; 1500 → "1,5 kg" */
export function textoPeso(gramos: number): string {
  return gramos >= 1000 ? `${(gramos / 1000).toLocaleString('es-AR')} kg` : `${gramos} g`;
}

/** ["harina", "manteca", "azúcar"] → "Harina, manteca y azúcar." */
export function textoIngredientes(ingredientes: string[]): string {
  const lista = ingredientes.map((ingrediente) => ingrediente.trim()).filter(Boolean);
  if (lista.length === 0) return '';
  const texto = lista.length > 1 ? `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}` : lista[0];
  return `${texto.charAt(0).toLocaleUpperCase('es-AR')}${texto.slice(1)}.`;
}

/** Lo que dice cada puntaje, de 1 a 5 estrellas. El 5 es el ganador */
export const TEXTO_PUNTAJE: Record<number, string> = {
  1: 'Puede mejorar',
  2: 'Está bien',
  3: 'Rico',
  4: '¡Riquísimo!',
  5: '¡Es mi ganador!',
};

/** 4.5 → "4,5"; 5 → "5,0" */
export function textoPromedio(promedio: number): string {
  return promedio.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/**
 * Una frase linda para el catálogo según cómo lo votaron: «¡El ganador de 12 clientes!». Con un puntaje bajo
 * no se festeja: solo cuántas opiniones tiene
 */
export function fraseRecomendacion(promedio: number, cantidad: number): string {
  const uno = cantidad === 1;
  if (promedio >= 4.5) return uno ? '¡Ya tiene su primer fan!' : `¡El ganador de ${cantidad} clientes!`;
  if (promedio >= 4) return uno ? 'A quien lo probó le encantó' : `Les encantó a ${cantidad} clientes`;
  if (promedio >= 3) return uno ? 'Lo recomienda 1 cliente' : `Lo recomiendan ${cantidad} clientes`;
  return uno ? '1 opinión' : `${cantidad} opiniones`;
}

/** 1 → "1 voto"; 12 → "12 votos" */
export function textoVotos(cantidad: number): string {
  return cantidad === 1 ? '1 voto' : `${cantidad} votos`;
}

const fechaCorta = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' });
const fechaConAnio = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Cuándo se dejó una recomendación: "16 de octubre"; si es de otro año, "16 de octubre de 2025" */
export function fechaRecomendacion(iso: string): string {
  const fecha = new Date(iso);
  return (fecha.getFullYear() === new Date().getFullYear() ? fechaCorta : fechaConAnio).format(fecha);
}

/**
 * Los textos del catálogo de Navidad. Viven acá, no en los componentes: el año que viene se cambian en un solo lugar.
 * Los adornos son solo estilos: todo lo que se lee va con <Text>
 */
export const TEXTOS_NAVIDAD = {
  saludo: '¡Felices fiestas!',
  bajada: 'Pedí lo tuyo para la mesa navideña.',
  /** La línea chica arriba del saludo */
  temporada: 'Temporada de fiestas',
  /** La sección de los productos sin tipo, si es la única */
  seccionUnica: 'Para estas fiestas',
  vacio: {
    titulo: 'Estamos horneando lo de las fiestas',
    texto: 'Muy pronto vas a ver acá todo lo que preparamos para la mesa navideña.',
  },
  pie: '¡Gracias por elegirnos estas fiestas!',
  /** El saludo de arriba de la Navidad de día, abierto, debajo de la marca */
  feliz: {
    temporada: 'Temporada de fiestas',
    titulo: '¡Feliz Navidad!',
    texto:
      'Este año, la mesa de las fiestas la armamos juntos. Horneamos cada pan dulce, cada budín y cada galletita con las mismas manos de siempre y mucho cariño, para que lo compartas con los que más querés.',
    cierre: 'Encargá con tiempo: ¡el horno ya está encendido!',
  },
} as const;
