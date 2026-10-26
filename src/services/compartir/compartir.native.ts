import { Directory, File, Paths } from 'expo-file-system';
import Share, { Social } from 'react-native-share';
import type { ArchivoParaCompartir, ResultadoCompartir } from './types';

const WHATSAPP = 'com.whatsapp';

// En la caché de la app, no en la galería: así no se llena el celular de copias. Si Android la vacía, se vuelve a bajar.
// Tiene que ser la caché: react-native-share solo puede compartir archivos de ahí (no los de Paths.document)
const carpeta = new Directory(Paths.cache, 'compartir');

function enCache(archivo: ArchivoParaCompartir) {
  return new File(carpeta, `${archivo.clave}.${archivo.tipo === 'video' ? 'mp4' : 'jpg'}`);
}

/** Lo baja la primera vez; después usa el que ya está. Baja a un .part: si se corta, no queda uno a medias */
async function descargar(archivo: ArchivoParaCompartir): Promise<File> {
  const destino = enCache(archivo);
  if (destino.exists) return destino;

  carpeta.create({ intermediates: true, idempotent: true });
  const parcial = new File(carpeta, `${destino.name}.part`);
  try {
    await File.downloadFileAsync(archivo.url, parcial, { idempotent: true });
    await parcial.move(destino, { overwrite: true });
  } catch (error) {
    if (parcial.exists) parcial.delete();
    throw error;
  }
  return destino;
}

export const sePuedeCompartir = true;

/**
 * Abre WhatsApp con la foto o el video y el texto. Ahí el dueño elige a quién (un chat, un grupo o «Mi estado») y
 * toca «Enviar». Resuelve apenas se abre WhatsApp: si después lo mandó o se volvió, no hay forma de saberlo
 */
export async function compartirEnWhatsApp({
  texto,
  archivo,
}: {
  texto: string;
  /** Sin archivo, va solo el texto */
  archivo?: ArchivoParaCompartir;
}): Promise<ResultadoCompartir> {
  // Sin este control, si no está WhatsApp, react-native-share abre el selector de apps del sistema
  const { isInstalled } = await Share.isPackageInstalled(WHATSAPP);
  if (!isInstalled) return 'sin-whatsapp';

  const local = archivo && (await descargar(archivo));
  await Share.shareSingle({
    social: Social.Whatsapp,
    ...(archivo &&
      local && { url: local.uri, type: archivo.tipo === 'video' ? 'video/mp4' : 'image/jpeg' }),
    message: texto || undefined,
  });
  return 'compartido';
}
