import { baseApi } from '@/services/api';
import {
  balanceSchema,
  clientesDelRangoSchema,
  gastoEnInsumosSchema,
  gustosMasVendidosSchema,
  productosMasVendidosSchema,
  resumenPedidosSchema,
} from '../schemas';
import type {
  Balance,
  ClientesDelRango,
  FiltrosBalance,
  FiltrosGustos,
  FiltrosProductosVendidos,
  GastoEnInsumos,
  GustosMasVendidos,
  ProductosMasVendidos,
  Rango,
  ResumenPedidos,
} from '../types';

/**
 * El tag de las listas de pedidos (el mismo de pedidosApi). Entregar un pedido, deshacer la entrega o cargar uno
 * lo invalidan: así el ranking se recarga solo cuando cambian las ventas
 */
const PEDIDOS = { type: 'Pedido', id: 'LISTA' } as const;
/** El tag de la lista de insumos (el mismo de insumosApi): cargar un insumo o una compra lo invalida */
const INSUMOS = { type: 'Insumo', id: 'LISTA' } as const;

export const metricasApi = baseApi.enhanceEndpoints({ addTagTypes: ['Pedido', 'Insumo'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Con token. Los productos más vendidos en el rango. Cada combinación de filtros es una caché aparte */
    productosMasVendidos: build.query<ProductosMasVendidos, FiltrosProductosVendidos>({
      query: (filtros) => ({ url: '/metricas/productos', params: filtros }),
      rawResponseSchema: productosMasVendidosSchema,
      providesTags: [PEDIDOS],
    }),

    /** Con token. Lo vendido de cada gusto */
    gustosMasVendidos: build.query<GustosMasVendidos, FiltrosGustos>({
      query: (filtros) => ({ url: '/metricas/gustos', params: filtros }),
      rawResponseSchema: gustosMasVendidosSchema,
      providesTags: [PEDIDOS],
    }),

    /** Con token. Los pedidos hechos en el rango: por estado, por origen, cancelados, ticket promedio y por día */
    resumenPedidos: build.query<ResumenPedidos, Rango>({
      query: (rango) => ({ url: '/metricas/pedidos', params: rango }),
      rawResponseSchema: resumenPedidosSchema,
      providesTags: [PEDIDOS],
    }),

    /** Con token. Los clientes que compraron en el rango: nuevos y los que vuelven */
    clientesDelRango: build.query<ClientesDelRango, Rango>({
      query: (rango) => ({ url: '/metricas/clientes', params: rango }),
      rawResponseSchema: clientesDelRangoSchema,
      providesTags: [PEDIDOS],
    }),

    /** Con token. En qué insumos se gastó más y cuánto aumentó cada uno */
    gastoEnInsumos: build.query<GastoEnInsumos, Rango>({
      query: (rango) => ({ url: '/metricas/insumos', params: rango }),
      rawResponseSchema: gastoEnInsumosSchema,
      providesTags: [INSUMOS],
    }),

    /** Con token. Lo que entra, lo que sale y la ganancia: cambia con los pedidos y con los insumos */
    balance: build.query<Balance, FiltrosBalance>({
      query: (filtros) => ({ url: '/metricas/balance', params: filtros }),
      rawResponseSchema: balanceSchema,
      providesTags: [PEDIDOS, INSUMOS],
    }),
  }),
});

export const {
  useProductosMasVendidosQuery,
  useGustosMasVendidosQuery,
  useResumenPedidosQuery,
  useClientesDelRangoQuery,
  useGastoEnInsumosQuery,
  useBalanceQuery,
} = metricasApi;
