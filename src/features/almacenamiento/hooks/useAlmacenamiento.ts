import { mensajeDeError } from '@/services/api';
import { useObtenerAlmacenamientoQuery } from '../api/almacenamientoApi';

/** Memoria, en Más: cuánto del plan de Cloudinary está usado y qué tan cerca está del límite */
export function useAlmacenamiento() {
  const consulta = useObtenerAlmacenamientoQuery();
  const uso = consulta.data;

  return {
    uso,
    cargando: consulta.isLoading,
    error: consulta.isError && !uso ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
