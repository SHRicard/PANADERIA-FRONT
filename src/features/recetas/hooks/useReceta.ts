import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { esSinReceta, useBorrarRecetaMutation, useObtenerRecetaQuery } from '../api/recetasApi';

/** La receta de un producto con sus costos, y sus acciones: realizarla, editarla, ponerle el precio al producto y borrarla */
export function useReceta(productoId: string) {
  const router = useRouter();
  const consulta = useObtenerRecetaQuery(productoId);
  const [borrarReceta, { isLoading: borrando }] = useBorrarRecetaMutation();
  const [errorBorrar, setErrorBorrar] = useState<string | null>(null);
  const sinReceta = esSinReceta(consulta.error);

  const confirmarBorrar = async () => {
    setErrorBorrar(null);
    try {
      await borrarReceta(productoId).unwrap();
      router.back();
    } catch (e) {
      setErrorBorrar(mensajeDeError(e));
    }
  };

  return {
    // Después de borrarla, RTK Query guarda los datos de antes junto con el 404: no se muestran
    receta: sinReceta ? undefined : consulta.data,
    cargando: consulta.isLoading,
    sinReceta,
    error: consulta.error && !sinReceta ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    realizar: () => router.push({ pathname: '/productos/[id]/receta/hacer', params: { id: productoId } }),
    editar: () => router.push({ pathname: '/productos/[id]/receta/editar', params: { id: productoId } }),
    actualizarPrecio: () => router.push({ pathname: '/productos/[id]/receta/precio', params: { id: productoId } }),
    borrar: () =>
      Alert.alert('¿Borrar la receta?', 'El producto no se toca: solo se borra con qué se hace y lo que cuesta.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: () => void confirmarBorrar() },
      ]),
    borrando,
    errorBorrar,
  };
}
