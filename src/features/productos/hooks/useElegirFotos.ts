import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { prepararFoto } from '../fotos';
import type { FotoLocal } from '../types';

/**
 * Elegir fotos de la galería o sacarlas con la cámara. Cada una se achica antes de entregarla a `alElegir`.
 * `lugares`: cuántas entran todavía (el back acepta hasta 10 por producto)
 */
export function useElegirFotos(lugares: number, alElegir: (fotos: FotoLocal[]) => void) {
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const preparar = async (assets: ImagePicker.ImagePickerAsset[]) => {
    setProcesando(true);
    const listas: FotoLocal[] = [];
    try {
      // De a una: achicar 10 fotos de celular a la vez se come la memoria
      for (const asset of assets.slice(0, lugares)) listas.push(await prepararFoto(asset));
    } catch {
      setAviso('No se pudo preparar una de las fotos. Probá con otra.');
    } finally {
      setProcesando(false);
      if (listas.length > 0) alElegir(listas);
    }
  };

  const elegirDeGaleria = async () => {
    setAviso(null);
    // Ojo: con selectionLimit en 0 la galería deja elegir sin límite
    if (lugares <= 0) return;
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: lugares,
      orderedSelection: true,
      quality: 1,
    });
    if (!resultado.canceled) await preparar(resultado.assets);
  };

  const sacarFoto = async () => {
    setAviso(null);
    if (lugares <= 0) return;
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      setAviso('Para sacar fotos, permití el acceso a la cámara en los ajustes del celular.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!resultado.canceled) await preparar(resultado.assets);
  };

  return { elegirDeGaleria, sacarFoto, procesando, aviso, lleno: lugares <= 0 };
}
