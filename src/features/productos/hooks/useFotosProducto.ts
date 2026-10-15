import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { mensajeDeError } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBorrarFotoMutation, useCambiarPortadaMutation } from '../api/productosApi';
import type { FotoDelSelector } from '../components/SelectorFotos';
import { FOTOS_MAX } from '../schemas';
import { quitarFoto, reintentarFoto, subirFotos } from '../store/subidaFotosSlice';
import type { Producto } from '../types';
import { useElegirFotos } from './useElegirFotos';

/**
 * Edición: las fotos de un producto que ya existe. Todo se aplica en el momento, sin esperar a "Guardar":
 * las nuevas empiezan a subirse apenas se eligen, tocar una guardada la hace portada y la X la borra
 * del producto y de Cloudinary (con confirmación)
 */
export function useFotosProducto(producto: Producto | undefined) {
  const dispatch = useAppDispatch();
  const [borrarFoto] = useBorrarFotoMutation();
  const [cambiarPortada] = useCambiarPortadaMutation();
  const [avisoError, setAvisoError] = useState<string | null>(null);
  /** La foto que se está pasando a portada, mientras el back responde */
  const [nuevaPortada, setNuevaPortada] = useState<string | null>(null);
  const productoId = producto?._id;
  const cola = useAppSelector((s) => s.subidaFotos.fotos);

  const enCola = useMemo(
    () => Object.values(cola).filter((foto) => foto.productoId === productoId),
    [cola, productoId]
  );
  const enServidor = producto?.imagenes ?? [];

  const eleccion = useElegirFotos(FOTOS_MAX - enServidor.length - enCola.length, (fotos) => {
    // Sin esperar: suben en segundo plano y siguen aunque el dueño salga de la pantalla
    if (productoId) void dispatch(subirFotos({ productoId, fotos }));
  });

  const delSelector: FotoDelSelector[] = [
    ...enServidor.map((imagen) => ({
      clave: imagen.id,
      uri: imagen.miniatura,
      quitable: imagen.id !== nuevaPortada,
      elegiblePortada: !nuevaPortada,
      ocupada: imagen.id === nuevaPortada,
    })),
    ...enCola.map((foto) => ({
      clave: foto.idLocal,
      uri: foto.uri,
      estado: foto.estado === 'error' ? ('error' as const) : ('subiendo' as const),
      // Una que se está subiendo no se puede frenar; una con error se puede descartar
      quitable: foto.estado === 'error',
      // Todavía no tiene id en el back: recién cuando termina de subir se puede elegir de portada
      elegiblePortada: false,
    })),
  ];

  const borrarDelServidor = async (imagenId: string) => {
    if (!productoId) return;
    setAvisoError(null);
    try {
      await borrarFoto({ productoId, imagenId }).unwrap();
    } catch (e) {
      setAvisoError(mensajeDeError(e));
    }
  };

  const hacerPortada = async (imagenId: string) => {
    if (!productoId || nuevaPortada || imagenId === enServidor[0]?.id) return;
    setAvisoError(null);
    setNuevaPortada(imagenId);
    try {
      await cambiarPortada({ productoId, imagenId }).unwrap();
    } catch (e) {
      setAvisoError(mensajeDeError(e));
    } finally {
      setNuevaPortada(null);
    }
  };

  const quitar = (clave: string) => {
    if (cola[clave]) {
      dispatch(quitarFoto(clave));
      return;
    }
    Alert.alert('¿Borrar esta foto?', 'Se borra del producto y del catálogo. No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => void borrarDelServidor(clave) },
    ]);
  };

  /** Tocar una foto guardada la hace portada; tocar una que no se subió la vuelve a intentar */
  const tocar = (clave: string) => {
    if (cola[clave]) {
      if (cola[clave].estado === 'error') void dispatch(reintentarFoto(clave));
      return;
    }
    void hacerPortada(clave);
  };

  return {
    delSelector,
    ...eleccion,
    aviso: avisoError ?? eleccion.aviso,
    quitar,
    tocar,
    hacerPortada: (clave: string) => void hacerPortada(clave),
  };
}
