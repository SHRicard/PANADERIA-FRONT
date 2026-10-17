import { config } from '@/config';
import type { Promo } from './types';

/** Lo que acompaña la publicación: el texto de la promo y, abajo, el link a la web (si está configurado) */
export function textoParaCompartir(promo: Promo): string {
  const link = config.webUrl ? `Hacé tu pedido acá 👉 ${config.webUrl}` : '';
  return [promo.texto, link].filter(Boolean).join('\n\n');
}

/** «Nunca la compartiste» / «Compartida 3 veces · la última, hoy» */
export function textoPublicaciones(promo: Promo, ahora = new Date()): string {
  if (!promo.ultimaPublicacion) return 'Nunca la compartiste';
  const veces = promo.vecesPublicada === 1 ? '1 vez' : `${promo.vecesPublicada} veces`;
  return `Compartida ${veces} · la última, ${cuando(new Date(promo.ultimaPublicacion), ahora)}`;
}

/** Lo que dura un video, como en la galería: «0:09», «1:05» */
export function textoDuracion(segundos: number): string {
  const enteros = Math.round(segundos);
  return `${Math.floor(enteros / 60)}:${String(enteros % 60).padStart(2, '0')}`;
}

function cuando(fecha: Date, ahora: Date): string {
  const dia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dias = Math.round((dia(ahora) - dia(fecha)) / 86_400_000);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });
}
