import { baseApi } from '@/services/api';
import {
  borradoAutomaticoSchema,
  ipNombradaSchema,
  paginaIpsSchema,
  paginaLogsSchema,
  paginaVisitasSchema,
  resumenLogsSchema,
} from '../schemas';
import type { DiasLogs, FiltrosLogs, PaginaIps, PaginaLogs, PaginaVisitas, ResumenLogs } from '../types';

/** Por página. El back acepta hasta 100 */
const POR_PAGINA = 20;
/**
 * Un solo tag para todo: el resumen y las dos listas muestran lo mismo desde distintos lados (el nombre de una IP va
 * en sus peticiones, cambiar el borrado automático puede borrar lo viejo), así que cualquier cambio recarga todo
 */
const LOGS = 'Log' as const;

// La IP viaja en la URL: las IPv6 tienen «:»
const urlIp = (ip: string) => `/logs/ips/${encodeURIComponent(ip)}`;

export const logsApi = baseApi.enhanceEndpoints({ addTagTypes: [LOGS] }).injectEndpoints({
  endpoints: (build) => ({
    obtenerResumenLogs: build.query<ResumenLogs, void>({
      query: () => '/logs/resumen',
      rawResponseSchema: resumenLogsSchema,
      providesTags: [LOGS],
    }),

    /** Las peticiones, la más nueva primero. Cada combinación de filtros es una caché aparte */
    listarLogs: build.infiniteQuery<PaginaLogs, FiltrosLogs, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      // Lo que va en undefined no viaja
      query: ({ queryArg, pageParam }) => ({ url: '/logs', params: { ...queryArg, pagina: pageParam, limite: POR_PAGINA } }),
      rawResponseSchema: paginaLogsSchema,
      providesTags: [LOGS],
    }),

    /** Las visitas, la más reciente primero. Con `ip`, solo las de esa IP; con `sospechosas`, solo las que tuvieron alguna */
    listarVisitas: build.infiniteQuery<PaginaVisitas, { ip?: string; sospechosas?: boolean }, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      query: ({ queryArg, pageParam }) => ({ url: '/logs/visitas', params: { ...queryArg, pagina: pageParam, limite: POR_PAGINA } }),
      rawResponseSchema: paginaVisitasSchema,
      providesTags: [LOGS],
    }),

    /** Las IP, la que se vio último primero. Con `sospechosas`, solo las que hicieron alguna sospechosa */
    listarIpsLogs: build.infiniteQuery<PaginaIps, { sospechosas?: boolean }, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (ultima) => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
      },
      query: ({ queryArg, pageParam }) => ({ url: '/logs/ips', params: { ...queryArg, pagina: pageParam, limite: POR_PAGINA } }),
      rawResponseSchema: paginaIpsSchema,
      providesTags: [LOGS],
    }),

    /** Ponerle (o cambiarle) el nombre a una IP: «Juan», «La compu del local» */
    nombrarIp: build.mutation<void, { ip: string; nombre: string }>({
      query: ({ ip, nombre }) => ({ url: urlIp(ip), method: 'PUT', body: { nombre } }),
      rawResponseSchema: ipNombradaSchema,
      transformResponse: () => undefined,
      invalidatesTags: [LOGS],
    }),

    /** Sacarle el nombre. Repetirlo no es un error */
    olvidarIp: build.mutation<void, string>({
      query: (ip) => ({ url: urlIp(ip), method: 'DELETE' }),
      invalidatesTags: [LOGS],
    }),

    /** Cada cuántos días se borran solos. Vale también para lo que ya está guardado */
    cambiarBorradoAutomatico: build.mutation<void, DiasLogs>({
      query: (diasLogs) => ({ url: '/logs/borrado-automatico', method: 'PUT', body: { diasLogs } }),
      rawResponseSchema: borradoAutomaticoSchema,
      transformResponse: () => undefined,
      invalidatesTags: [LOGS],
    }),

    /** Borra todos los logs. Los nombres de las IP quedan */
    borrarLogs: build.mutation<void, void>({
      query: () => ({ url: '/logs', method: 'DELETE' }),
      invalidatesTags: [LOGS],
    }),
  }),
});

export const {
  useObtenerResumenLogsQuery,
  useListarLogsInfiniteQuery,
  useListarVisitasInfiniteQuery,
  useListarIpsLogsInfiniteQuery,
  useNombrarIpMutation,
  useOlvidarIpMutation,
  useCambiarBorradoAutomaticoMutation,
  useBorrarLogsMutation,
} = logsApi;
