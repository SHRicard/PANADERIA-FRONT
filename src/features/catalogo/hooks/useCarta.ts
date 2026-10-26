import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useListarSeccionesQuery } from '../api/catalogoApi';
import { useFiltrosCatalogo } from './useFiltrosCatalogo';

/**
 * La carta: los productos activos agrupados por tipo, en el orden en que los manda el back (la sección sin tipo, al
 * final). Sin paginar: se lee entera. El tipo, el gusto y el nombre los filtra el back
 */
export function useCarta() {
  const router = useRouter();
  const filtros = useFiltrosCatalogo();
  const consulta = useListarSeccionesQuery(filtros.consulta);
  // currentData y no data: al cambiar de filtro no se ven las secciones del filtro anterior mientras carga
  const datos = consulta.currentData;

  return {
    secciones: datos?.secciones ?? [],
    total: datos?.totalProductos ?? 0,
    cargando: !datos && consulta.isFetching,
    error: consulta.isError && !datos ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await Promise.all([consulta.refetch(), filtros.refrescarOpciones()]);
    },
    filtros,
    abrir: (id: string) => router.push({ pathname: '/producto/[id]', params: { id } }),
  };
}
