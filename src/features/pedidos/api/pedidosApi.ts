import { baseApi } from '@/services/api';
import {
  agendaSchema,
  clientesSchema,
  detallePedidoSchema,
  diaAgendaSchema,
  paginaPedidosSchema,
  produccionDelDiaSchema,
} from '../schemas';
import type {
  Agenda,
  ClienteGuardado,
  DiaAgenda,
  FechaEntregaEditada,
  DetallePedido,
  FiltrosPedidos,
  ItemsPedidoEditados,
  NuevoPedidoManual,
  PaginaPedidos,
  ProduccionDelDia,
} from '../types';

/** Pedidos por página. El back acepta hasta 100 */
const POR_PAGINA = 20;
/** Las listas (con cualquier filtro). Cada detalle tiene su propio tag: { type: 'Pedido', id } */
const LISTA = { type: 'Pedido', id: 'LISTA' } as const;
/** La agenda: cambia con todo lo que mueve los productos de un día (pedido nuevo, otra fecha, otros productos, cancelar) */
const AGENDA = 'Agenda' as const;

export const pedidosApi = baseApi.enhanceEndpoints({ addTagTypes: ['Pedido', 'Cliente', AGENDA] }).injectEndpoints({
  endpoints: (build) => {
    // Cada acción responde el detalle actualizado: se guarda en la caché del detalle (sin otro pedido)
    // y se recargan las listas, porque el pedido cambió de estado
    const accion = (paso: 'sena' | 'entrega' | 'cancelacion' | 'visto', method: 'PUT' | 'DELETE') =>
      build.mutation<DetallePedido, string>({
        query: (id) => ({ url: `/pedidos/${id}/${paso}`, method }),
        rawResponseSchema: detallePedidoSchema,
        // Cancelar (o deshacerlo) saca o vuelve a sumar sus productos en la agenda
        invalidatesTags: paso === 'cancelacion' ? [LISTA, AGENDA] : [LISTA],
        async onQueryStarted(id, { dispatch, queryFulfilled }): Promise<void> {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerPedido', id, data));
          } catch {
            // El error lo muestra el detalle
          }
        },
      });

    return {
      /** La lista del dueño, de a páginas, del más nuevo al más viejo. Cada filtro de estado es una caché aparte */
      listarPedidos: build.infiniteQuery<PaginaPedidos, FiltrosPedidos, number>({
        infiniteQueryOptions: {
          initialPageParam: 1,
          getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
        },
        // El estado en undefined no viaja: vienen todos
        query: ({ queryArg, pageParam }) => ({
          url: '/pedidos',
          params: { ...queryArg, pagina: pageParam, limite: POR_PAGINA },
        }),
        rawResponseSchema: paginaPedidosSchema,
        providesTags: [LISTA],
      }),

      /** Un pedido con los datos del cliente y cuántos pedidos tiene */
      obtenerPedido: build.query<DetallePedido, string>({
        query: (id) => `/pedidos/${id}`,
        rawResponseSchema: detallePedidoSchema,
        providesTags: (_resultado, _error, id) => [{ type: 'Pedido', id }],
      }),

      /** Confirma la seña (pasa a confirmado) o corrige el monto. El back no deja que pase del total */
      registrarSena: build.mutation<DetallePedido, { id: string; monto: number }>({
        query: ({ id, monto }) => ({ url: `/pedidos/${id}/sena`, method: 'PUT', body: { monto } }),
        rawResponseSchema: detallePedidoSchema,
        invalidatesTags: [LISTA],
        async onQueryStarted({ id }, { dispatch, queryFulfilled }): Promise<void> {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerPedido', id, data));
          } catch {
            // El error lo muestra el detalle
          }
        },
      }),
      /** Vuelve a pendiente (si la confirmó por error) */
      quitarSena: accion('sena', 'DELETE'),
      /** Entregado, con o sin seña */
      registrarEntrega: accion('entrega', 'PUT'),
      /** Vuelve a confirmado si tiene seña, si no a pendiente */
      quitarEntrega: accion('entrega', 'DELETE'),
      cancelarPedido: accion('cancelacion', 'PUT'),
      /** Vuelve a confirmado si tiene seña, si no a pendiente */
      quitarCancelacion: accion('cancelacion', 'DELETE'),
      /** El dueño ya lo vio: deja de salir como nuevo. No cambia el estado. Recarga las listas (la tarjeta cambia) */
      marcarVisto: accion('visto', 'PUT'),
      /** Vuelve a salir como nuevo (por si lo marcó sin querer) */
      quitarVisto: accion('visto', 'DELETE'),

      /**
       * Un pedido que le hicieron al dueño por fuera de la web (WhatsApp, en persona). Responde el detalle: se guarda
       * en su caché para abrirlo sin otro pedido. Puede sumar un cliente nuevo: recarga la lista de clientes
       */
      crearPedidoManual: build.mutation<DetallePedido, NuevoPedidoManual>({
        query: (pedido) => ({ url: '/pedidos/manuales', method: 'POST', body: pedido }),
        rawResponseSchema: detallePedidoSchema,
        invalidatesTags: [LISTA, 'Cliente', AGENDA],
        async onQueryStarted(_pedido, { dispatch, queryFulfilled }): Promise<void> {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerPedido', data._id, data));
          } catch {
            // El error lo muestra el formulario
          }
        },
      }),

      /**
       * Cambia los productos de un pedido abierto (el cliente pidió sumar, sacar o cambiar algo). Va la lista completa:
       * lo que no va, se saca. Lo que ya estaba conserva el precio del pedido; lo nuevo entra con el de hoy. Responde el
       * detalle: se guarda en su caché. Cambió el total: recarga las listas, el inicio y las métricas
       */
      editarItemsPedido: build.mutation<DetallePedido, ItemsPedidoEditados>({
        query: ({ id, items }) => ({ url: `/pedidos/${id}/items`, method: 'PUT', body: { items } }),
        rawResponseSchema: detallePedidoSchema,
        invalidatesTags: [LISTA, AGENDA],
        async onQueryStarted({ id }, { dispatch, queryFulfilled }): Promise<void> {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerPedido', id, data));
          } catch {
            // El error lo muestra la pantalla de edición
          }
        },
      }),

      /**
       * Otro día (el cliente le pidió cambiarlo): cualquiera, también uno lleno. Solo con el pedido abierto (si no, 409).
       * Responde el detalle: se guarda en su caché. Recarga las listas y la agenda (el pedido pasó a otro día)
       */
      cambiarFechaEntrega: build.mutation<DetallePedido, FechaEntregaEditada>({
        query: ({ id, fechaEntrega }) => ({ url: `/pedidos/${id}/fecha-entrega`, method: 'PUT', body: { fechaEntrega } }),
        rawResponseSchema: detallePedidoSchema,
        invalidatesTags: [LISTA, AGENDA],
        async onQueryStarted({ id }, { dispatch, queryFulfilled }): Promise<void> {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerPedido', id, data));
          } catch {
            // El error lo muestra el detalle
          }
        },
      }),

      /** Todos los días del mes (AAAA-MM) con sus pedidos y productos, qué tan lleno está, si llegó al tope y si lo marcó */
      obtenerAgenda: build.query<Agenda, string>({
        query: (mes) => ({ url: '/agenda', params: { mes } }),
        rawResponseSchema: agendaSchema,
        providesTags: [AGENDA],
      }),
      /**
       * Lo que hay que preparar un día: los productos sumados de sus pedidos que falta entregar. Se recarga con la
       * agenda (pedido nuevo, otra fecha, otros productos, cancelar) y con las listas (seña, entrega)
       */
      obtenerProduccionDelDia: build.query<ProduccionDelDia, string>({
        query: (fecha) => `/agenda/${fecha}/productos`,
        rawResponseSchema: produccionDelDiaSchema,
        providesTags: [AGENDA, LISTA],
      }),
      /**
       * Cuántos hizo de un producto ese día (el número que queda, no lo que suma). Responde la hoja entera, que se
       * guarda en su caché, ya ordenada por el back (los listos al final)
       */
      anotarHechos: build.mutation<ProduccionDelDia, { fecha: string; productoId: string; hechos: number }>({
        query: ({ fecha, productoId, hechos }) => ({
          url: `/agenda/${fecha}/productos/${productoId}`,
          method: 'PUT',
          body: { hechos },
        }),
        rawResponseSchema: produccionDelDiaSchema,
        // El circulito de la agenda dice lo que falta: con lo hecho, cambia
        invalidatesTags: [AGENDA],
        async onQueryStarted({ fecha }, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(pedidosApi.util.upsertQueryData('obtenerProduccionDelDia', fecha, data));
          } catch {
            // El error lo muestra la hoja, que vuelve a pedir lo guardado
          }
        },
      }),
      /** «Agenda llena»: la web deja de ofrecer ese día. Marcarlo otra vez no es un error */
      marcarAgendaLlena: build.mutation<DiaAgenda, string>({
        query: (fecha) => ({ url: `/agenda/${fecha}/cierre`, method: 'PUT' }),
        rawResponseSchema: diaAgendaSchema,
        invalidatesTags: [AGENDA],
      }),
      /** Vuelve a abrir el día para la web */
      quitarAgendaLlena: build.mutation<DiaAgenda, string>({
        query: (fecha) => ({ url: `/agenda/${fecha}/cierre`, method: 'DELETE' }),
        rawResponseSchema: diaAgendaSchema,
        invalidatesTags: [AGENDA],
      }),

      /**
       * «¿Cuántos querés hacer este día?»: menos que su tope de siempre. Lo que no quiere hacer cuenta como ocupado, así
       * que el día puede pasar a «Casi» o «Llena» en la web. Ponerlo otra vez lo reemplaza
       */
      elegirQuiereHacer: build.mutation<DiaAgenda, { fecha: string; quiereHacer: number }>({
        query: ({ fecha, quiereHacer }) => ({ url: `/agenda/${fecha}/quiere-hacer`, method: 'PUT', body: { quiereHacer } }),
        rawResponseSchema: diaAgendaSchema,
        // La respuesta no trae `faltan` (el circulito): se vuelve a pedir el mes
        invalidatesTags: [AGENDA],
      }),
      /** «Volver a lo normal»: el día vuelve a su tope de siempre */
      quitarQuiereHacer: build.mutation<DiaAgenda, string>({
        query: (fecha) => ({ url: `/agenda/${fecha}/quiere-hacer`, method: 'DELETE' }),
        rawResponseSchema: diaAgendaSchema,
        invalidatesTags: [AGENDA],
      }),

      /** Los que ya hicieron algún pedido: para elegir uno en el pedido manual sin escribir su teléfono */
      listarClientes: build.query<ClienteGuardado[], void>({
        query: () => '/clientes',
        rawResponseSchema: clientesSchema,
        providesTags: ['Cliente'],
      }),
    };
  },
});

export const {
  useListarPedidosInfiniteQuery,
  useObtenerPedidoQuery,
  useRegistrarSenaMutation,
  useQuitarSenaMutation,
  useRegistrarEntregaMutation,
  useQuitarEntregaMutation,
  useCancelarPedidoMutation,
  useQuitarCancelacionMutation,
  useMarcarVistoMutation,
  useQuitarVistoMutation,
  useCrearPedidoManualMutation,
  useEditarItemsPedidoMutation,
  useCambiarFechaEntregaMutation,
  useObtenerAgendaQuery,
  useObtenerProduccionDelDiaQuery,
  useAnotarHechosMutation,
  useMarcarAgendaLlenaMutation,
  useQuitarAgendaLlenaMutation,
  useElegirQuiereHacerMutation,
  useQuitarQuiereHacerMutation,
  useListarClientesQuery,
} = pedidosApi;
