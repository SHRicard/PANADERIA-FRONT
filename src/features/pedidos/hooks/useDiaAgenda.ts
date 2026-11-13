import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { diaDeHoy, mesDeDia } from '@/shared/utils';
import { useAppDispatch } from '@/store';
import {
  pedidosApi,
  useAnotarHechosMutation,
  useElegirQuiereHacerMutation,
  useListarPedidosInfiniteQuery,
  useMarcarAgendaLlenaMutation,
  useObtenerAgendaQuery,
  useObtenerProduccionDelDiaQuery,
  useQuitarAgendaLlenaMutation,
  useQuitarQuiereHacerMutation,
} from '../api/pedidosApi';
import { formularioQuiereHacerSchema } from '../schemas';
import type { FormularioQuiereHacer, Pedido } from '../types';

// La URL puede venir escrita a mano o vieja: solo se piden días con forma de día
const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Un día de la agenda (/agenda/[fecha]), al que se llega tocando el día en el calendario del inicio: sus números, si
 * está cerrado para la web, «Qué hay que hacer» (los productos sumados de sus pedidos), «Agenda llena» y sus pedidos
 */
export function useDiaAgenda(fechaDeLaRuta: string | undefined) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const valida = !!fechaDeLaRuta && FORMATO_DIA.test(fechaDeLaRuta);
  const fecha = valida ? fechaDeLaRuta : '';
  const [error, setError] = useState<string | null>(null);

  // Los números del día salen de la agenda de su mes. Los pedidos de la web llegan sin que la app se entere: al entrar
  // se vuelve a pedir
  const delMes = useObtenerAgendaQuery(mesDeDia(fecha), { skip: !valida, refetchOnMountOrArgChange: true });
  const dia = delMes.data?.dias.find((d) => d.fecha === fecha) ?? null;

  const delDia = useListarPedidosInfiniteQuery({ fechaEntrega: fecha }, { skip: !valida, refetchOnMountOrArgChange: true });
  const paginas = delDia.currentData?.pages;
  const pedidos = useMemo(() => paginas?.flatMap((pagina) => pagina.pedidos) ?? [], [paginas]);
  // Los números del día («2 pedidos · 19 productos») no cuentan los cancelados: van aparte, al final, para que la
  // lista no los contradiga
  const abiertos = useMemo(() => pedidos.filter((pedido) => pedido.estado !== 'cancelado'), [pedidos]);
  const cancelados = useMemo(() => pedidos.filter((pedido) => pedido.estado === 'cancelado'), [pedidos]);

  const [marcarLlena, { isLoading: marcando }] = useMarcarAgendaLlenaMutation();
  const [quitarLlena, { isLoading: abriendo }] = useQuitarAgendaLlenaMutation();
  const cambiarLlena = async () => {
    if (!dia) return;
    setError(null);
    try {
      await (dia.llena ? quitarLlena(dia.fecha) : marcarLlena(dia.fecha)).unwrap();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  // ── ¿Cuántos querés hacer este día? Menos que su tope de siempre (docs/quiere-hacer.md) ──
  const [elegirQuiereHacer, { isLoading: guardandoQuiereHacer }] = useElegirQuiereHacerMutation();
  const [quitarQuiereHacer, { isLoading: quitandoQuiereHacer }] = useQuitarQuiereHacerMutation();
  const [editandoQuiereHacer, setEditandoQuiereHacer] = useState(false);
  const [errorQuiereHacer, setErrorQuiereHacer] = useState<string | null>(null);
  const formQuiereHacer = useForm<FormularioQuiereHacer>({
    resolver: zodResolver(formularioQuiereHacerSchema),
    defaultValues: { quiereHacer: '' },
  });
  const escrito = useWatch({ control: formQuiereHacer.control, name: 'quiereHacer' });
  const numeroEscrito = /^\d+$/.test(escrito.trim()) ? Number(escrito) : null;
  // Si ya tiene más pedidos que lo que quiere hacer, se quedan, pero el día se llena: se avisa antes de guardar
  const avisoQuiereHacer =
    dia && numeroEscrito !== null && numeroEscrito >= 1 && numeroEscrito < dia.productos
      ? `Ya tenés ${dia.productos} productos pedidos para ese día. Se quedan, pero el día va a quedar lleno.`
      : null;
  const guardarQuiereHacer = formQuiereHacer.handleSubmit(async ({ quiereHacer }) => {
    setErrorQuiereHacer(null);
    try {
      await elegirQuiereHacer({ fecha, quiereHacer: Number(quiereHacer) }).unwrap();
      setEditandoQuiereHacer(false);
    } catch (e) {
      setErrorQuiereHacer(mensajeDeError(e));
    }
  });
  const volverALoNormal = async () => {
    setError(null);
    try {
      await quitarQuiereHacer(fecha).unwrap();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  // ── Qué hay que hacer: los productos sumados de sus pedidos. Se pide recién al abrir la hoja ──
  const [viendoProduccion, setViendoProduccion] = useState(false);
  const produccion = useObtenerProduccionDelDiaQuery(fecha, { skip: !valida || !viendoProduccion, refetchOnMountOrArgChange: true });
  const [guardarHechos] = useAnotarHechosMutation();
  const [errorHechos, setErrorHechos] = useState<string | null>(null);
  // La tanda de cada producto: cuántos sacó ahora, antes de tocar «Agregar». Solo en pantalla hasta que la agrega
  const [tandas, setTandas] = useState<Record<string, number>>({});
  const [guardandoHechos, setGuardandoHechos] = useState<string | null>(null);
  const anotarHechos = async (productoId: string, hechos: number) => {
    setErrorHechos(null);
    // Nunca un número inválido al back (un NaN viaja como null y el back lo rechaza con un 400 que no se entiende)
    if (!Number.isInteger(hechos) || hechos < 0) {
      if (__DEV__) console.warn('[hechos] número inválido, no se manda:', { productoId, hechos, tandas });
      setErrorHechos('No se pudo anotar ese número. Cerrá la hoja y volvé a abrirla.');
      return;
    }
    setGuardandoHechos(productoId);
    try {
      await guardarHechos({ fecha, productoId, hechos }).unwrap();
      setTandas(({ [productoId]: _agregada, ...resto }) => resto);
    } catch (e) {
      setErrorHechos(mensajeDeError(e));
    } finally {
      setGuardandoHechos(null);
    }
  };

  return {
    fecha,
    /** La URL no trae un día (link viejo o escrito a mano) */
    invalida: !valida,
    /** Sus números y si está lleno. null mientras carga */
    dia,
    productosPorDia: delMes.data?.productosPorDia ?? null,
    cargando: !delMes.data && delMes.isFetching,
    errorCarga: delMes.isError && !delMes.data ? mensajeDeError(delMes.error) : null,
    reintentar: () => {
      void delMes.refetch();
      void delDia.refetch();
    },
    /** Para el tirar para abajo: los números del día y sus pedidos */
    refrescar: async () => {
      if (!valida) return;
      await Promise.all([delMes.refetch(), delDia.refetch()]);
    },
    error,

    /** Los que cuentan en los números del día (pendientes, confirmados y entregados) */
    pedidos: abiertos,
    /** Los cancelados del día: no cuentan, se muestran aparte */
    cancelados,
    cargandoPedidos: !paginas && delDia.isFetching,
    errorPedidos: delDia.isError && !paginas ? mensajeDeError(delDia.error) : null,
    hayMasPedidos: delDia.hasNextPage,
    cargarMasPedidos: () => {
      if (delDia.hasNextPage && !delDia.isFetching) void delDia.fetchNextPage();
    },
    /** Los días que ya pasaron no se reducen: no hay nada que cambiar */
    yaPaso: valida && fecha < diaDeHoy(),

    // ¿Cuántos querés hacer este día?
    quiereHacer: {
      /** null = los de siempre */
      valor: dia?.quiereHacer ?? null,
      form: formQuiereHacer,
      editando: editandoQuiereHacer,
      editar: () => {
        setErrorQuiereHacer(null);
        formQuiereHacer.reset({ quiereHacer: dia?.quiereHacer ? String(dia.quiereHacer) : '' });
        setEditandoQuiereHacer(true);
      },
      dejarDeEditar: () => setEditandoQuiereHacer(false),
      guardar: () => void guardarQuiereHacer(),
      guardando: guardandoQuiereHacer,
      /** «Ya tenés 10 productos pedidos…»: lo escrito es menos que lo que ya le pidieron */
      aviso: avisoQuiereHacer,
      error: errorQuiereHacer,
      volverALoNormal: () => void volverALoNormal(),
      quitando: quitandoQuiereHacer,
    },

    cambiarLlena: () => void cambiarLlena(),
    cambiandoLlena: marcando || abriendo,
    abrirPedido: (pedido: Pedido) => {
      void dispatch(pedidosApi.util.prefetch('obtenerPedido', pedido._id, { ifOlderThan: 30 }));
      router.push({ pathname: '/pedidos/[id]', params: { id: pedido._id } });
    },

    // Qué hay que hacer: la hoja con los productos del día
    produccion: {
      visible: viendoProduccion,
      abrir: () => setViendoProduccion(true),
      cerrar: () => setViendoProduccion(false),
      datos: produccion.currentData ?? null,
      cargando: !produccion.currentData && produccion.isFetching,
      error: produccion.isError && !produccion.currentData ? mensajeDeError(produccion.error) : errorHechos,
      /** La tanda que está armando de un producto (cuántos sacó ahora), antes de agregarla */
      tandaDe: (productoId: string) => tandas[productoId] ?? 0,
      cambiarTanda: (productoId: string, cantidad: number) => setTandas((antes) => ({ ...antes, [productoId]: cantidad })),
      /** «Agregar»: suma la tanda a lo que ya hizo y lo guarda en el back */
      agregarTanda: (productoId: string, hechos: number) => {
        const tanda = tandas[productoId] ?? 0;
        if (tanda > 0) void anotarHechos(productoId, hechos + tanda);
      },
      /** «Listo»: los hizo todos */
      marcarListo: (productoId: string, cantidad: number) => void anotarHechos(productoId, cantidad),
      /** «Deshacer» en uno listo (se equivocó): vuelve a 0 */
      deshacer: (productoId: string) => void anotarHechos(productoId, 0),
      /** El producto que se está guardando: su botón muestra la carga */
      guardandoHechos,
      reintentar: () => void produccion.refetch(),
    },
  };
}

export type DiaDeLaAgenda = ReturnType<typeof useDiaAgenda>;
