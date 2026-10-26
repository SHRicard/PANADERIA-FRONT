// Cómo se leen los datos del producto en la web

/**
 * El título de una sección de la carta: el nombre del tipo. Los que no tienen tipo van al final, como «Otros»; si
 * son los únicos (el dueño todavía no usa tipos), no son «otros» de nada
 */
export function tituloSeccion(tipo: { nombre: string } | null, unica: boolean): string {
  if (tipo) return tipo.nombre;
  return unica ? 'Nuestros productos' : 'Otros';
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
