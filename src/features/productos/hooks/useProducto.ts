import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { useBorrarProductoMutation, useEditarProductoMutation } from '../api/productosApi';
import { quitarFoto, quitarFotosDeProducto, reintentarFoto } from '../store/subidaFotosSlice';
import { useProductoGuardado } from './useProductoGuardado';

/** El detalle de un producto, con sus acciones: editar, pausar o activar y eliminar */
export function useProducto(id: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { producto, cargando, error, refrescar } = useProductoGuardado(id);
  const cola = useAppSelector((s) => s.subidaFotos.fotos);
  const enCola = useMemo(() => Object.values(cola).filter((foto) => foto.productoId === id), [cola, id]);
  const [borrarProducto, { isLoading: eliminando }] = useBorrarProductoMutation();
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [editarProducto, { isLoading: cambiandoEstado }] = useEditarProductoMutation();
  const [errorEstado, setErrorEstado] = useState<string | null>(null);

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/productos'));

  const confirmarEliminar = async () => {
    setErrorEliminar(null);
    try {
      await borrarProducto(id).unwrap();
      // Lo que quedaba en la cola ya no tiene a dónde subir
      dispatch(quitarFotosDeProducto(id));
      volver();
    } catch (e) {
      setErrorEliminar(mensajeDeError(e));
    }
  };

  const eliminar = () => {
    if (!producto) return;
    Alert.alert(`¿Eliminar «${producto.nombre}»?`, 'Se borran también todas sus fotos. No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => void confirmarEliminar() },
    ]);
  };

  // Un toque: el pan dulce se pausa en enero y se activa en diciembre, sin entrar a editar
  const alternarEstado = async () => {
    if (!producto) return;
    setErrorEstado(null);
    try {
      await editarProducto({ id, datos: { disponible: !producto.disponible } }).unwrap();
    } catch (e) {
      setErrorEstado(mensajeDeError(e));
    }
  };

  return {
    producto,
    enCola,
    cargando,
    error,
    reintentar: () => void refrescar(),
    refrescar: async () => {
      await refrescar();
    },
    editar: () => router.push({ pathname: '/productos/[id]/editar', params: { id } }),
    alternarEstado: () => void alternarEstado(),
    cambiandoEstado,
    errorEstado,
    eliminar,
    eliminando,
    errorEliminar,
    volver,
    reintentarFotos: (ids: string[]) => ids.forEach((idLocal) => void dispatch(reintentarFoto(idLocal))),
    descartarFotos: (ids: string[]) => ids.forEach((idLocal) => dispatch(quitarFoto(idLocal))),
  };
}
