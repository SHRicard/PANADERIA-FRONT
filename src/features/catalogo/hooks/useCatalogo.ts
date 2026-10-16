import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useListarCategoriasQuery } from '@/features/productos';
import { mensajeDeError } from '@/services/api';
import { useListarCatalogoInfiniteQuery } from '../api/catalogoApi';

// Espera a que el cliente deje de escribir: no un pedido por letra
const ESPERA_BUSQUEDA_MS = 300;

/**
 * La lista del catálogo público, de a páginas, con el buscador y el gusto.
 * `porPagina`: la carta pide todo de una (se lee entera, agrupada por gusto); la vidriera, de a 20
 */
export function useCatalogo(porPagina: number) {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');
  const [gusto, setGusto] = useState<string | null>(null);

  useEffect(() => {
    const espera = setTimeout(() => setBuscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [texto]);

  // Los filtros vacíos van en undefined: no viajan y no arman otra caché
  const consulta = useListarCatalogoInfiniteQuery({
    buscar: buscar || undefined,
    categoria: gusto ?? undefined,
    limite: porPagina,
  });
  // currentData y no data: al cambiar de filtro no se ve la lista del filtro anterior mientras carga
  const paginas = consulta.currentData?.pages;
  const productos = useMemo(() => paginas?.flatMap((pagina) => pagina.productos) ?? [], [paginas]);

  const categorias = useListarCategoriasQuery();
  // Para la web, solo los gustos que tienen productos activos, con cuántos tiene cada uno
  const gustos = useMemo(() => categorias.data?.filter(({ cantidad }) => cantidad > 0) ?? [], [categorias.data]);
  // Todo el catálogo, sin filtros: sale de los gustos (cada uno trae cuántos productos activos tiene)
  const resumen = useMemo(
    () =>
      categorias.data
        ? { productos: categorias.data.reduce((suma, { cantidad }) => suma + cantidad, 0), gustos: gustos.length }
        : null,
    [categorias.data, gustos.length],
  );

  return {
    productos,
    /** Cuántos productos activos hay en total y en cuántos gustos. null mientras cargan */
    resumen,
    /** Cuántos hay con estos filtros, contando los que todavía no se cargaron */
    total: paginas?.[0]?.totalProductos ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await Promise.all([consulta.refetch(), categorias.refetch()]);
    },

    hayMas: consulta.hasNextPage,
    cargandoMas: consulta.isFetchingNextPage,
    errorMas: consulta.isFetchNextPageError ? mensajeDeError(consulta.error) : null,
    /** Se llama al llegar al final de la lista: trae la página siguiente si hay y no está trayendo otra */
    cargarMas: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },

    filtros: {
      texto,
      setTexto,
      /** Lo que se está buscando de verdad (después de la espera), para los mensajes */
      buscando: buscar,
      gusto,
      setGusto,
      gustos,
      hayFiltros: Boolean(buscar || gusto),
      limpiar: () => {
        setTexto('');
        setBuscar('');
        setGusto(null);
      },
    },

    abrir: (id: string) => router.push({ pathname: '/producto/[id]', params: { id } }),
  };
}
