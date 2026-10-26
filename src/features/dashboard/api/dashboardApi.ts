import { baseApi } from '@/services/api';
import { resumenSchema } from '../schemas';
import type { Resumen } from '../types';

/**
 * El tag de las listas de pedidos (el mismo de pedidosApi). La seña, la entrega, la cancelación y el pedido manual
 * lo invalidan: así el resumen se recarga solo. Los pedidos de la web no avisan: llegan al tirar para abajo
 */
const PEDIDOS = { type: 'Pedido', id: 'LISTA' } as const;

export const dashboardApi = baseApi.enhanceEndpoints({ addTagTypes: ['Pedido'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Con token. Los pedidos de hoy, lo vendido y los que siguen abiertos */
    resumenDelDia: build.query<Resumen, void>({
      query: () => '/resumen',
      rawResponseSchema: resumenSchema,
      providesTags: [PEDIDOS],
    }),
  }),
});

export const { useResumenDelDiaQuery } = dashboardApi;
