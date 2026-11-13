import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useCambiarAjustesMutation } from '@/features/ajustes';
import { mensajeDeError } from '@/services/api';
import { mesDeHoy, sumarMeses } from '@/shared/utils';
import { useObtenerAgendaQuery } from '../api/pedidosApi';
import { diasDeLaAgenda } from '../agenda';
import { formularioProductosPorDiaSchema } from '../schemas';
import type { FormularioProductosPorDia } from '../types';

/**
 * La agenda del inicio: el tope y el mes pintado como en la web (verde «Libre», amarillo «Casi», rojo «Llena»). Al
 * tocar un día se abre su pantalla (/agenda/[fecha], `useDiaAgenda`) con sus números y sus pedidos: así el inicio no
 * queda cargado. Un día se cierra para la web al llegar al tope del dueño (sus productos por día) o cuando él lo marca.
 * La usa el inicio (dashboard), que la refresca al tirar
 */
export function useAgenda() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // ── El mes que se mira: arranca en el de hoy y se mueve con las flechas ──
  const [mes, setMes] = useState(mesDeHoy);

  // Los pedidos de la web llegan sin que la app se entere: al entrar al inicio se vuelve a pedir
  const consulta = useObtenerAgendaQuery(mes, { refetchOnMountOrArgChange: true });
  const agenda = consulta.data;

  // ── La referencia: cuántos productos por día, más o menos ──
  const [cambiarAjustes, { isLoading: guardandoReferencia }] = useCambiarAjustesMutation();
  const [editandoReferencia, setEditandoReferencia] = useState(false);
  const form = useForm<FormularioProductosPorDia>({
    resolver: zodResolver(formularioProductosPorDiaSchema),
    defaultValues: { productosPorDia: '' },
  });
  const guardarReferencia = form.handleSubmit(async ({ productosPorDia }) => {
    setError(null);
    try {
      await cambiarAjustes({ productosPorDia: productosPorDia === '' ? null : Number(productosPorDia) }).unwrap();
      setEditandoReferencia(false);
      // El color de cada día lo calcula el back con la referencia: se vuelven a pedir los meses
      await consulta.refetch();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  return {
    // El mes del calendario
    mes,
    dias: diasDeLaAgenda(agenda),
    alMesAnterior: () => setMes((actual) => sumarMeses(actual, -1)),
    alMesSiguiente: () => setMes((actual) => sumarMeses(actual, 1)),
    productosPorDia: agenda?.productosPorDia ?? null,
    cargando: !agenda && consulta.isFetching,
    errorCarga: consulta.isError && !agenda ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    /** Para el tirar para abajo del inicio */
    refrescar: async () => {
      await consulta.refetch();
    },
    error,
    /** Tocar un día abre su pantalla, con sus números, «Qué hay que hacer» y sus pedidos */
    abrirDia: (fecha: string) => router.push({ pathname: '/agenda/[fecha]', params: { fecha } }),

    // La referencia
    form,
    editandoReferencia,
    editarReferencia: () => {
      form.reset({ productosPorDia: agenda?.productosPorDia ? String(agenda.productosPorDia) : '' });
      setEditandoReferencia(true);
    },
    dejarDeEditarReferencia: () => setEditandoReferencia(false),
    guardarReferencia,
    guardandoReferencia,
  };
}

export type AgendaDelInicio = ReturnType<typeof useAgenda>;
