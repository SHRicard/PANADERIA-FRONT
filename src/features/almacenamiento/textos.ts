import type { AlertTone, OpcionSegmentado } from '@/shared/ui/atoms';
import { nombreParaMostrar } from '@/shared/utils';
import type { ColorToken } from '@/theme';
import type { ArchivoAlmacenado, NivelUso, OrigenArchivo } from './types';

/** Qué se le dice al dueño en cada nivel. El tono va al <Alert> (cada uno con su ícono) y el color, a la barra de uso */
export const TEXTOS_NIVEL: Record<NivelUso, { tono: AlertTone; color: ColorToken; titulo: string; detalle: string }> = {
  ok: {
    tono: 'success',
    color: 'success',
    titulo: 'Todo en orden',
    detalle: 'Hay lugar para seguir subiendo fotos y videos.',
  },
  atencion: {
    tono: 'warning',
    color: 'warning',
    titulo: 'Se está llenando',
    detalle: 'Usaste más del 75% del plan. Abajo está lo que más ocupa: borrá las fotos y promos que ya no uses.',
  },
  critico: {
    tono: 'danger',
    color: 'danger',
    titulo: 'Casi sin lugar',
    detalle: 'Usaste más del 90% del plan. Si llega al 100%, Cloudinary puede dejar el catálogo sin fotos: borrá lo que ya no uses.',
  },
  excedido: {
    tono: 'danger',
    color: 'danger',
    titulo: 'Te pasaste del plan',
    detalle:
      'Cloudinary te va a mandar avisos por email y, si sigue así, deshabilita la cuenta: no se pueden subir fotos y el catálogo se queda sin ellas.',
  },
};

const UN_MB = 1024 * 1024;
const UN_GB = 1024 * UN_MB;
const decimal = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

/** 8398233 → "8 MB"; 1288490188 → "1,2 GB" */
export function formatearBytes(bytes: number): string {
  if (bytes >= UN_GB) return `${decimal.format(bytes / UN_GB)} GB`;
  if (bytes >= UN_MB) return `${decimal.format(bytes / UN_MB)} MB`;
  return `${decimal.format(bytes / 1024)} KB`;
}

const dosDecimales = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

/** 0.43 → "0,43" */
export const formatearCreditos = (creditos: number) => dosDecimales.format(creditos);

/** 0.03 → "0,03 créditos"; 1 → "1 crédito" */
export const textoCreditos = (creditos: number) => `${formatearCreditos(creditos)} ${creditos === 1 ? 'crédito' : 'créditos'}`;

/** 1.72 → "1,7%" */
export const formatearPorcentaje = (porcentaje: number) => `${decimal.format(porcentaje)}%`;

const formatoDia = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' });

/** "2026-10-16" → "16 de octubre". Al mediodía, para que ninguna zona horaria lo corra de día */
export const fechaDelCalculo = (fecha: string) => formatoDia.format(new Date(`${fecha}T12:00:00`));

// ── La lista de archivos ──────────────────────────────────────────────────────

/** El filtro de la lista: «todo» no viaja al back */
export type FiltroArchivos = 'todo' | OrigenArchivo;

export const FILTROS_ARCHIVOS: readonly OpcionSegmentado<FiltroArchivos>[] = [
  { valor: 'todo', label: 'Todo' },
  { valor: 'producto', label: 'Productos' },
  { valor: 'promo', label: 'Promos' },
];

/** "1 archivo, 138,3 KB en total"; sin archivos, lo dice */
export function textoTotalArchivos(total: number, bytes: number): string {
  if (total === 0) return 'No hay archivos';
  return `${total} ${total === 1 ? 'archivo' : 'archivos'}, ${formatearBytes(bytes)} en total`;
}

/** Para la key de la lista y para saber cuál se está borrando */
export const claveArchivo = (archivo: ArchivoAlmacenado) =>
  archivo.origen === 'producto' ? archivo.imagenId : archivo.promoId;

/** El nombre del producto (como se muestra en el resto de la app) o el título de la promo */
export const tituloArchivo = (archivo: ArchivoAlmacenado) =>
  archivo.origen === 'producto' ? nombreParaMostrar(archivo.nombre) : archivo.titulo;

/** "Portada · 138 KB", "Foto · pausado · 98 KB", "Promo · video · 4,2 MB" */
export function detalleArchivo(archivo: ArchivoAlmacenado): string {
  const partes =
    archivo.origen === 'producto'
      ? [archivo.portada ? 'Portada' : 'Foto', ...(archivo.disponible ? [] : ['pausado'])]
      : ['Promo', archivo.tipo === 'video' ? 'video' : 'foto'];
  return [...partes, formatearBytes(archivo.bytes)].join(' · ');
}

/** Lo que se le pregunta antes de borrar: no se puede deshacer */
export function confirmacionBorrado(archivo: ArchivoAlmacenado): { titulo: string; mensaje: string } {
  if (archivo.origen === 'promo') {
    return {
      titulo: `¿Borrar «${archivo.titulo}»?`,
      mensaje: `Se borra la promo entera, con su ${archivo.tipo === 'video' ? 'video' : 'foto'}. No se puede deshacer.`,
    };
  }
  return {
    titulo: '¿Borrar esta foto?',
    mensaje: `Se borra de «${nombreParaMostrar(archivo.nombre)}» y del catálogo.${archivo.portada ? ' Es la portada: la siguiente pasa a serlo.' : ''} No se puede deshacer.`,
  };
}
