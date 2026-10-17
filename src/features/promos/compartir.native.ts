import { Directory, File, Paths } from 'expo-file-system';
import Share, { Social } from 'react-native-share';
import type { Promo, ResultadoCompartir } from './types';

const WHATSAPP = 'com.whatsapp';

// En la caché de la app, no en la galería: así no se llena el celular de copias. Si Android la vacía, se vuelve a bajar.
// Tiene que ser la caché: react-native-share solo puede compartir archivos de ahí (no los de Paths.document)
const carpeta = new Directory(Paths.cache, 'promos');

/** El archivo de una promo no cambia nunca (editar solo toca título y texto): con el id alcanza para el nombre */
function enCache(promo: Promo) {
  return new File(carpeta, `promo-${promo._id}.${promo.tipo === 'video' ? 'mp4' : 'jpg'}`);
}

/** Lo baja la primera vez; después usa el que ya está. Baja a un .part: si se corta, no queda uno a medias */
async function descargar(promo: Promo): Promise<File> {
  const destino = enCache(promo);
  if (destino.exists) return destino;

  carpeta.create({ intermediates: true, idempotent: true });
  const parcial = new File(carpeta, `${destino.name}.part`);
  try {
    await File.downloadFileAsync(promo.url, parcial, { idempotent: true });
    await parcial.move(destino, { overwrite: true });
  } catch (error) {
    if (parcial.exists) parcial.delete();
    throw error;
  }
  return destino;
}

export const sePuedeCompartir = true;

/**
 * Abre WhatsApp con la foto o el video de la promo y el texto. Ahí el dueño toca «Mi estado» y «Enviar».
 * Resuelve apenas se abre WhatsApp: si después publicó o se volvió, no hay forma de saberlo
 */
export async function compartirEnEstado(promo: Promo, texto: string): Promise<ResultadoCompartir> {
  // Sin este control, si no está WhatsApp, react-native-share abre el selector de apps del sistema
  const { isInstalled } = await Share.isPackageInstalled(WHATSAPP);
  if (!isInstalled) return 'sin-whatsapp';

  const archivo = await descargar(promo);
  await Share.shareSingle({
    social: Social.Whatsapp,
    url: archivo.uri,
    type: promo.tipo === 'video' ? 'video/mp4' : 'image/jpeg',
    message: texto || undefined,
  });
  return 'compartido';
}
