import { useState } from 'react';
import { mesDeDia, mesDeHoy, sumarMeses } from '@/shared/utils';
import { useObtenerAgendaQuery } from '../api/pedidosApi';
import { diasDeLaAgenda } from '../agenda';

/**
 * El calendario para que el dueño elija un día (pedido manual, cambiar la fecha): cualquier mes y cualquier día, con
 * los colores de la agenda («Libre», «Casi», «Llena») para que vea cómo viene cada uno. Arranca en el mes del día elegido, o en el de hoy
 */
export function useCalendarioDueno(seleccionado: string | null) {
  const [mes, setMes] = useState(() => (seleccionado ? mesDeDia(seleccionado) : mesDeHoy()));
  const agenda = useObtenerAgendaQuery(mes);

  return {
    mes,
    dias: diasDeLaAgenda(agenda.data),
    alMesAnterior: () => setMes((actual) => sumarMeses(actual, -1)),
    alMesSiguiente: () => setMes((actual) => sumarMeses(actual, 1)),
    /** Para abrir el calendario en el mes de un día (el del pedido, al cambiarle la fecha) */
    irAlMesDe: (dia: string) => setMes(mesDeDia(dia)),
  };
}
