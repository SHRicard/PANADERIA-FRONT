import { useRouter } from 'expo-router';
import { mensajeDeError, type ApiError } from '@/services/api';
import { useObtenerInsumoQuery } from '../api/insumosApi';

/** Un insumo con su historial, y a dónde llevan sus acciones */
export function useInsumo(id: string) {
  const router = useRouter();
  const consulta = useObtenerInsumoQuery(id);

  return {
    insumo: consulta.data,
    cargando: consulta.isLoading,
    /** Un 404 no es una falla: el insumo no existe */
    noExiste: (consulta.error as Partial<ApiError> | undefined)?.status === 404,
    error: consulta.error ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    cargarCompra: () => router.push({ pathname: '/insumos/[id]/actualizar', params: { id, modo: 'compra' } }),
    corregir: () => router.push({ pathname: '/insumos/[id]/actualizar', params: { id, modo: 'corregir' } }),
    volver: () => (router.canGoBack() ? router.back() : router.replace('/insumos')),
  };
}
