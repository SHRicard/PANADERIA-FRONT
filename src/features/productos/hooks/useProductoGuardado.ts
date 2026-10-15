import { mensajeDeError } from '@/services/api';
import { useObtenerProductoQuery } from '../api/productosApi';

/**
 * Un producto del back, para el detalle y la edición. Si se abrió desde la lista, ya está en la caché
 * y no hace otro pedido; si se abrió de otra forma (un link), lo trae
 */
export function useProductoGuardado(id: string) {
  const consulta = useObtenerProductoQuery(id);
  const noExiste = consulta.error !== undefined && 'status' in consulta.error && consulta.error.status === 404;

  return {
    producto: noExiste ? undefined : consulta.data,
    cargando: consulta.isLoading,
    // Un 404 no es un error para mostrar: la pantalla dice "ya no existe"
    error: consulta.isError && !noExiste ? mensajeDeError(consulta.error) : null,
    refrescar: () => consulta.refetch(),
  };
}
