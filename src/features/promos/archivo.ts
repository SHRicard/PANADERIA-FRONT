import type { ImagePickerAsset } from 'expo-image-picker';
import { MAX_SEGUNDOS_VIDEO, MB_POR_FOTO, MB_POR_VIDEO } from './schemas';
import type { ArchivoPromo } from './types';

const MB = 1024 * 1024;
// El celular y Cloudinary no miden la duración igual: el back da medio segundo de margen
const MAX_MS_VIDEO = (MAX_SEGUNDOS_VIDEO + 0.5) * 1000;

/**
 * Revisa lo elegido ANTES de subirlo, con los mismos límites que el back: así no se gasta una subida que el back va a
 * rechazar. Devuelve el archivo listo o el mensaje para mostrar
 */
export function leerArchivo(asset: ImagePickerAsset): ArchivoPromo | string {
  if (asset.type === 'video') {
    // duration viene en milisegundos
    if (asset.duration != null && asset.duration > MAX_MS_VIDEO) {
      const segundos = Math.round(asset.duration / 1000);
      return `El video dura ${segundos} segundos y puede durar hasta ${MAX_SEGUNDOS_VIDEO}. Recortalo en la galería y elegilo de nuevo.`;
    }
    if (asset.fileSize != null && asset.fileSize > MB_POR_VIDEO * MB) {
      return `El video pesa más de ${MB_POR_VIDEO} MB. Grabalo en menor calidad (1080p) o recortalo.`;
    }
    const duracionSegundos = asset.duration != null ? Math.round(asset.duration / 1000) : undefined;
    return { uri: asset.uri, tipo: 'video', duracionSegundos };
  }
  if (asset.fileSize != null && asset.fileSize > MB_POR_FOTO * MB) {
    return `La foto pesa más de ${MB_POR_FOTO} MB. Elegí otra.`;
  }
  return { uri: asset.uri, tipo: 'imagen' };
}
