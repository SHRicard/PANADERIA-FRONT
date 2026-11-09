import { useEffect, useMemo, useState } from 'react';
import { useListarProductosInfiniteQuery } from '@/features/productos';
import { mensajeDeError } from '@/services/api';

// Espera a que el dueño deje de escribir: no un pedido por letra
const ESPERA_BUSQUEDA_MS = 350;

/**
 * Buscar productos para sumar a un pedido: la lista del dueño (también los pausados), de a páginas. Lo usan el
 * pedido manual y «Editar productos»
 */
export function useBuscadorProductos() {
  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');
  useEffect(() => {
    const espera = setTimeout(() => setBuscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [texto]);

  const consulta = useListarProductosInfiniteQuery({ buscar: buscar || undefined });
  const paginas = consulta.currentData?.pages;
  const productos = useMemo(() => paginas?.flatMap((pagina) => pagina.productos) ?? [], [paginas]);

  return {
    texto,
    setTexto,
    productos,
    cargandoProductos: !paginas && consulta.isFetching,
    errorCargaProductos: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentarProductos: () => void consulta.refetch(),
    hayMasProductos: consulta.hasNextPage,
    cargandoMasProductos: consulta.isFetchingNextPage,
    cargarMasProductos: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },
  };
}

export type BuscadorProductos = ReturnType<typeof useBuscadorProductos>;
