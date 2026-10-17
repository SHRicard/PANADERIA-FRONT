import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { leerArchivo } from '../archivo';
import type { ArchivoPromo } from '../types';

/** Elegir de la galería la foto o el video de una promo. Si no cumple los límites, avisa y no lo entrega */
export function useElegirArchivoPromo(alElegir: (archivo: ArchivoPromo) => void) {
  const [aviso, setAviso] = useState<string | null>(null);

  const elegir = async () => {
    setAviso(null);
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      // Comprime la foto (el back igual la deja en 1200 px de ancho); no toca los videos
      quality: 0.8,
    });
    if (resultado.canceled) return;

    const archivo = leerArchivo(resultado.assets[0]);
    if (typeof archivo === 'string') setAviso(archivo);
    else alElegir(archivo);
  };

  return { elegir, aviso };
}
