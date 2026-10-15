import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { productosApi, useListarProductosInfiniteQuery } from '../api/productosApi';
import { quitarFoto, reintentarFoto, type FotoEnCola } from '../store/subidaFotosSlice';
import type { EstadoProducto, Producto } from '../types';
import { useCategorias } from './useCategorias';

// Espera a que el dueño deje de escribir: no un pedido por letra
const ESPERA_BUSQUEDA_MS = 350;

/** La lista de productos del admin: de a páginas, con filtros y con las fotos que todavía se están subiendo */
export function useProductos() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categorias = useCategorias();
  const fotosEnCola = useAppSelector((s) => s.subidaFotos.fotos);

  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState<EstadoProducto | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => {
    const espera = setTimeout(() => setBuscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [texto]);

  // Los filtros vacíos van en undefined: no viajan y no arman otra caché
  const consulta = useListarProductosInfiniteQuery({
    buscar: buscar || undefined,
    categoria: categoria ?? undefined,
    estado: estado ?? undefined,
  });
  // currentData y no data: al cambiar de filtro no se ve la lista del filtro anterior mientras carga
  const paginas = consulta.currentData?.pages;
  const productos = useMemo(() => paginas?.flatMap((pagina) => pagina.productos) ?? [], [paginas]);

  const colaPorProducto = useMemo(() => {
    const porProducto: Record<string, FotoEnCola[]> = {};
    for (const foto of Object.values(fotosEnCola)) (porProducto[foto.productoId] ??= []).push(foto);
    return porProducto;
  }, [fotosEnCola]);

  const hayFiltros = Boolean(buscar || estado || categoria);

  return {
    productos,
    /** Cuántos hay con estos filtros, contando los que todavía no se cargaron */
    total: paginas?.[0]?.totalProductos ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
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
      estado,
      setEstado,
      categoria,
      setCategoria,
      categorias,
      hayFiltros,
      limpiar: () => {
        setTexto('');
        setBuscar('');
        setEstado(null);
        setCategoria(null);
      },
    },

    /** Las fotos de un producto que todavía no están en el servidor */
    colaDe: (productoId: string): FotoEnCola[] => colaPorProducto[productoId] ?? [],
    reintentarFotos: (ids: string[]) => ids.forEach((id) => void dispatch(reintentarFoto(id))),
    descartarFotos: (ids: string[]) => ids.forEach((id) => dispatch(quitarFoto(id))),
    nuevo: () => router.push('/productos/nuevo'),
    abrir: (producto: Producto) => {
      // El detalle arranca con lo que ya trajo la lista: se ve al instante, sin otro pedido
      void dispatch(productosApi.util.upsertQueryData('obtenerProducto', producto._id, producto));
      router.push({ pathname: '/productos/[id]', params: { id: producto._id } });
    },
  };
}
