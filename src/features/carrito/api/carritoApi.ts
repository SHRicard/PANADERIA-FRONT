import { baseApi } from '@/services/api';
import { cotizacionSchema, pedidoCreadoSchema } from '../schemas';
import type { Cotizacion, ItemCarrito, NuevoPedido, PedidoCreado } from '../types';

// Todo público: el back no pide token
export const carritoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Precios de hoy, subtotales, total y los productos que ya no están disponibles. No guarda nada.
     * Es una query aunque sea POST: el mismo carrito queda en caché y no se vuelve a pedir
     */
    cotizarCarrito: build.query<Cotizacion, ItemCarrito[]>({
      query: (items) => ({ url: '/carrito', method: 'POST', body: { items } }),
      rawResponseSchema: cotizacionSchema,
    }),

    /** Confirma el pedido. El back recalcula precios y total: lo que mande el front no cuenta */
    crearPedido: build.mutation<PedidoCreado, NuevoPedido>({
      query: (pedido) => ({ url: '/pedidos', method: 'POST', body: pedido }),
      rawResponseSchema: pedidoCreadoSchema,
    }),
  }),
});

export const { useCotizarCarritoQuery, useCrearPedidoMutation } = carritoApi;
