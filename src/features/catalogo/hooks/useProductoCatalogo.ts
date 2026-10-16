import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useObtenerDelCatalogoQuery } from '../api/catalogoApi';

/** Un producto del catálogo, con todas sus fotos. El link puede llegar por WhatsApp, y ser viejo */
export function useProductoCatalogo(id: string) {
  const router = useRouter();
  const consulta = useObtenerDelCatalogoQuery(id);
  // Pausado, eliminado o un id que no existe: no es un error, es «no está disponible»
  const noDisponible = consulta.error !== undefined && 'status' in consulta.error && consulta.error.status === 404;

  return {
    producto: noDisponible ? undefined : consulta.data,
    cargando: consulta.isLoading,
    noDisponible,
    error: consulta.isError && !noDisponible ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    /** Si se entró directo por el link, no hay a dónde volver: va al catálogo */
    volver: () => (router.canGoBack() ? router.back() : router.replace('/')),
  };
}
