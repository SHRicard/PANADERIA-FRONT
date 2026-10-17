import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useAppDispatch } from '@/store';
import { pedidosApi, useListarPedidosInfiniteQuery } from '../api/pedidosApi';
import type { EstadoPedido, Pedido } from '../types';

/** La lista de pedidos del dueño: de a páginas y con el filtro de estado */
export function usePedidos() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [estado, setEstado] = useState<EstadoPedido | null>(null);

  const consulta = useListarPedidosInfiniteQuery({ estado: estado ?? undefined });
  // currentData y no data: al cambiar de filtro no se ve la lista del filtro anterior mientras carga
  const paginas = consulta.currentData?.pages;
  const pedidos = useMemo(() => paginas?.flatMap((pagina) => pagina.pedidos) ?? [], [paginas]);

  return {
    pedidos,
    /** Cuántos hay con este filtro, contando los que todavía no se cargaron */
    total: paginas?.[0]?.totalPedidos ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },

    hayMas: consulta.hasNextPage,
    cargandoMas: consulta.isFetchingNextPage,
    errorMas: consulta.isFetchNextPageError ? mensajeDeError(consulta.error) : null,
    cargarMas: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },

    estado,
    setEstado,
    abrir: (pedido: Pedido) => {
      // El detalle arranca con lo que ya trajo la lista y completa los datos del cliente al llegar
      void dispatch(pedidosApi.util.prefetch('obtenerPedido', pedido._id, { ifOlderThan: 30 }));
      router.push({ pathname: '/pedidos/[id]', params: { id: pedido._id } });
    },
  };
}
