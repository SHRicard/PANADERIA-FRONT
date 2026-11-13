import { formatearFecha } from './formatearFecha';

// Los días del back son texto AAAA-MM-DD (un día de calendario, sin hora). Para mostrarlos se arma la fecha a la
// medianoche LOCAL: con new Date('2026-11-25') sería la medianoche UTC, y en Argentina se leería el 24

const dosCifras = (n: number) => String(n).padStart(2, '0');

/** "2026-11-25" → la fecha local de ese día */
export function fechaDeDia(dia: string): Date {
  const [anio, mes, numero] = dia.split('-').map(Number);
  return new Date(anio, mes - 1, numero);
}

/** "2026-11-25" → "miércoles 25 de noviembre" */
export function formatearDia(dia: string): string {
  return formatearFecha(fechaDeDia(dia));
}

/** "2026-11-25" → "25/11" */
export function diaCorto(dia: string): string {
  const [, mes, numero] = dia.split('-');
  return `${numero}/${mes}`;
}

/** Una fecha → su día, "2026-11-25" (con la fecha del celular) */
export function diaDeFecha(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosCifras(fecha.getMonth() + 1)}-${dosCifras(fecha.getDate())}`;
}

/** Hoy en el celular, "2026-11-11" */
export const diaDeHoy = () => diaDeFecha(new Date());

/** "2026-11-30", +1 → "2026-12-01" */
export function sumarDias(dia: string, cuantos: number): string {
  const fecha = fechaDeDia(dia);
  fecha.setDate(fecha.getDate() + cuantos);
  return diaDeFecha(fecha);
}

/** "2026-11-25" → "2026-11" */
export const mesDeDia = (dia: string) => dia.slice(0, 7);

/** El mes de hoy en el celular, "2026-11" */
export function mesDeHoy(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${dosCifras(hoy.getMonth() + 1)}`;
}

/** "2026-11", +1 → "2026-12"; "2026-01", -1 → "2025-12" */
export function sumarMeses(mes: string, cuantos: number): string {
  const [anio, numero] = mes.split('-').map(Number);
  const fecha = new Date(anio, numero - 1 + cuantos, 1);
  return `${fecha.getFullYear()}-${dosCifras(fecha.getMonth() + 1)}`;
}

const formatoMes = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });

/** "2026-11" → "noviembre de 2026" */
export function nombreDelMes(mes: string): string {
  return formatoMes.format(fechaDeDia(`${mes}-01`));
}

/**
 * Las semanas del mes para dibujar un calendario: de lunes a domingo, con null en los huecos del principio y del
 * final. "2026-11" → [[null × 6, "2026-11-01"], ["2026-11-02", …], …]
 */
export function semanasDelMes(mes: string): (string | null)[][] {
  const [anio, numero] = mes.split('-').map(Number);
  const cuantos = new Date(anio, numero, 0).getDate();
  // getDay: 0 = domingo. Corrido para que la semana empiece el lunes
  const huecos = (new Date(anio, numero - 1, 1).getDay() + 6) % 7;
  const celdas: (string | null)[] = [
    ...Array<null>(huecos).fill(null),
    ...Array.from({ length: cuantos }, (_, i) => `${mes}-${dosCifras(i + 1)}`),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);
  return Array.from({ length: celdas.length / 7 }, (_, i) => celdas.slice(i * 7, i * 7 + 7));
}
