import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { FotoLocal } from './types';

// El back guarda hasta 1200 px de ancho: subir una foto de 4000 px solo hace más lenta la subida.
// Con 1600 px y calidad 0.8 queda en unos 300–600 KB
const ANCHO_MAX = 1600;
const CALIDAD = 0.8;

let contador = 0;
const nuevoIdLocal = () => `${Date.now()}-${contador++}`;

/** Achica y comprime la foto elegida. El resultado es un JPEG en la caché de la app, listo para la cola */
export async function prepararFoto(asset: ImagePickerAsset): Promise<FotoLocal> {
  const contexto = ImageManipulator.manipulate(asset.uri);
  if (asset.width > ANCHO_MAX) contexto.resize({ width: ANCHO_MAX });
  const imagen = await contexto.renderAsync();

  try {
    const { uri } = await imagen.saveAsync({ compress: CALIDAD, format: SaveFormat.JPEG });
    return { idLocal: nuevoIdLocal(), uri };
  } finally {
    // Libera la foto decodificada: con 10 fotos de celular la memoria se nota
    imagen.release();
    contexto.release();
  }
}
