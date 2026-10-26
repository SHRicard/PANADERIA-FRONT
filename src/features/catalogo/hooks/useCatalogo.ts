import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useListarCatalogoInfiniteQuery } from '../api/catalogoApi';
import { useFiltrosCatalogo } from './useFiltrosCatalogo';

/** La vidriera: los productos activos de a páginas, con el tipo, el gusto y el nombre (los filtra el back) */
export function useCatalogo(porPagina: number) {
  const router = useRouter();
  const filtros = useFiltrosCatalogo();
  const consulta = useListarCatalogoInfiniteQuery({ ...filtros.consulta, limite: porPagina });
  // currentData y no data: al cambiar de filtro no se ve la lista del filtro anterior mientras carga
  const paginas = consulta.currentData?.pages;
  const productos = useMemo(() => paginas?.flatMap((pagina) => pagina.productos) ?? [], [paginas]);

  return {
    productos,
    /** Cuántos hay con estos filtros, contando los que todavía no se cargaron */
    total: paginas?.[0]?.totalProductos ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await Promise.all([consulta.refetch(), filtros.refrescarOpciones()]);
    },

    hayMas: consulta.hasNextPage,
    cargandoMas: consulta.isFetchingNextPage,
    errorMas: consulta.isFetchNextPageError ? mensajeDeError(consulta.error) : null,
    /** Se llama al llegar al final de la lista: trae la página siguiente si hay y no está trayendo otra */
    cargarMas: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },

    filtros,
    abrir: (id: string) => router.push({ pathname: '/producto/[id]', params: { id } }),
  };
}
