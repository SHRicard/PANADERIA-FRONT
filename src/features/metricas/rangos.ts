// El rango viaja como días AAAA-MM-DD de Argentina, como lo cuenta el back

import type { Agrupacion } from './types';

export const PERIODOS = ['semana', 'mes', 'anio', 'todo'] as const;
export type Periodo = (typeof PERIODOS)[number];

export const TEXTO_PERIODO: Record<Periodo, string> = {
  semana: 'Últimos 7 días',
  mes: 'Este mes',
  anio: 'Este año',
  todo: 'Siempre',
};

// La misma cuenta que el back: "hoy" es el de Argentina aunque el celular esté en otra zona. en-CA da AAAA-MM-DD
const formatoDia = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

function restarDias(dia: string, dias: number): string {
  const fecha = new Date(`${dia}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - dias);
  return fecha.toISOString().slice(0, 10);
}

/** El rango de cada período, con hoy incluido. «Siempre» no manda fechas: todo el historial */
export function rangoDe(periodo: Periodo): { desde?: string; hasta?: string } {
  const hoy = formatoDia.format(new Date());
  switch (periodo) {
    case 'semana':
      return { desde: restarDias(hoy, 6), hasta: hoy };
    case 'mes':
      return { desde: `${hoy.slice(0, 8)}01`, hasta: hoy };
    case 'anio':
      return { desde: `${hoy.slice(0, 5)}01-01`, hasta: hoy };
    case 'todo':
      return {};
  }
}

/** De a cuánto agrupar la serie del balance en cada período: que el gráfico no tenga ni 1 ni 300 barras */
export const AGRUPAR_DEL_PERIODO: Record<Periodo, Agrupacion> = {
  semana: 'dia',
  mes: 'dia',
  anio: 'mes',
  todo: 'mes',
};
