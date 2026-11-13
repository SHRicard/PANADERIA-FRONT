import { Gauge } from 'lucide-react-native';
import type { DiaCalendario } from '@/shared/ui/atoms';
import { diaDeHoy, formatearDia, sumarDias } from '@/shared/utils';
import { ESTADOS_WEB } from './schemas';
import type { Agenda, DiaAgenda } from './types';

/** Los carteles de cada día. «Libre», «Casi» y «Llena» son los mismos que ve el cliente en la web */
export const MARCA_LIBRE = 'Libre';
export const MARCA_CASI = 'Casi';
export const MARCA_LLENA = 'Llena';
/**
 * Solo para el dueño: el día llegó a su tope (sus productos por día). Es un aviso, no un cierre: la web lo sigue
 * ofreciendo (el cliente lo ve «Casi») y se puede seguir pidiendo. El día se cierra solo con «Agenda llena», a mano
 */
export const MARCA_TOPE = 'Tope';
/** El ícono de un día en que el dueño quiere hacer menos que su tope (en el calendario, la leyenda y la pantalla del día) */
export const ICONO_QUIERE_HACER = Gauge;

/** El día de hoy, en blanco: no se ofrece en la web, así que su color no dice nada; lo que importa es ubicarlo */
export const MARCA_HOY = 'Hoy';

// Hasta qué parte del tope un día está libre (la misma cuenta que el back: con 25, hasta 10)
const PARTE_LIBRE = 0.4;

/** Los rangos de cada estado con los productos por día del dueño: con 25, libre hasta 10, casi de 11 a 24, tope desde 25 */
export function rangosDeLaAgenda(productosPorDia: number) {
  const hastaLibre = Math.floor(productosPorDia * PARTE_LIBRE);
  return { hastaLibre, desdeCasi: hastaLibre + 1, hastaCasi: productosPorDia - 1, tope: productosPorDia };
}

type EstadoWeb = (typeof ESTADOS_WEB)[number];

/**
 * Cómo ve el día el cliente en la web. Lo manda el back (`estadoWeb`, la misma cuenta del carrito); el back de antes no
 * lo manda, y ahí se deduce igual: «llena» solo si lo marcó el dueño, «casi» desde el 40 % (también en el tope o pasado)
 */
function estadoWebDe({ estadoWeb, llena, nivel }: DiaAgenda): EstadoWeb {
  const delBack = ESTADOS_WEB.find((estado) => estado === estadoWeb);
  if (delBack) return delBack;
  if (llena) return 'llena';
  return nivel === 'medio' || nivel === 'alto' ? 'casi' : 'libre';
}

/**
 * Cómo se ve cada día en el calendario del dueño: lo mismo que ve el cliente (verde «Libre», amarillo «Casi», rojo
 * «Llena» solo si lo marcó: es lo único que lo cierra para la web) más «Tope», en amarillo, solo para él: llegó a su
 * tope, un aviso (la web lo sigue ofreciendo). Con un circulito en la esquina con cuántos productos le
 * quedan por preparar (para ver qué día tiene trabajo sin tocarlo). Los días que ya pasaron, limpios: sin color ni circulito.
 * Ninguno está deshabilitado: el dueño puede anotar un pedido en cualquier día, también en uno lleno (pudo arreglarlo
 * con el cliente)
 */
export function diasDeLaAgenda(agenda: Agenda | undefined): Record<string, DiaCalendario> {
  const hoy = diaDeHoy();
  const dias: Record<string, DiaCalendario> = {};
  for (const dia of agenda?.dias ?? []) {
    const { fecha, tope, productos, faltan, quiereHacer } = dia;
    const estado = estadoWebDe(dia);
    const llena = estado === 'llena';
    // Los que ya pasaron, limpios: sin color ni circulito (al dueño le hacen ruido)
    if (fecha < hoy) continue;
    // El circulito con lo que le queda por preparar (lo que pidieron menos lo que ya hizo): se ve de un vistazo qué día
    // tiene trabajo. Con todo hecho, no va
    const resto = faltan ?? productos;
    const contador = { contador: resto, queCuenta: resto === 1 ? 'producto por hacer' : 'productos por hacer' };
    // Un día en que quiere hacer menos: el ícono en la esquina, y el lector de pantalla lo dice después del estado
    const reducido = quiereHacer !== null ? { icono: ICONO_QUIERE_HACER } : {};
    const leer = (estado: string) => (quiereHacer !== null ? `${estado}, querés hacer hasta ${quiereHacer}` : estado);
    if (fecha === hoy) {
      const estadoHoy = llena ? 'Hoy, agenda llena' : tope ? 'Hoy, llegaste a tu tope' : 'Hoy';
      dias[fecha] = { aviso: MARCA_HOY, avisoAccesible: leer(estadoHoy), hoy: true, ...contador, ...reducido };
      continue;
    }
    if (llena) dias[fecha] = { aviso: MARCA_LLENA, avisoAccesible: leer('Agenda llena'), tono: 'peligro', ...contador, ...reducido };
    else if (tope) {
      dias[fecha] = { aviso: MARCA_TOPE, avisoAccesible: leer('Llegaste a tu tope, la web lo sigue ofreciendo'), tono: 'atencion', ...contador, ...reducido };
    } else if (estado === 'casi') {
      dias[fecha] = { aviso: MARCA_CASI, avisoAccesible: leer('Casi lleno'), tono: 'atencion', ...contador, ...reducido };
    } else dias[fecha] = { aviso: MARCA_LIBRE, avisoAccesible: leer(MARCA_LIBRE), tono: 'exito', ...contador, ...reducido };
  }
  return dias;
}

/** "2026-11-25" → "Para el miércoles 25 de noviembre". Los pedidos de antes de la agenda no tienen día */
export function textoParaElDia(dia: string | null): string {
  return dia ? `Para el ${formatearDia(dia)}` : 'Sin día de entrega';
}

/** El título del día elegido en la agenda: «Hoy · miércoles 11 de noviembre», «Mañana · …» o solo la fecha */
export function tituloDelDia(dia: string): string {
  const hoy = diaDeHoy();
  if (dia === hoy) return `Hoy · ${formatearDia(dia)}`;
  if (dia === sumarDias(hoy, 1)) return `Mañana · ${formatearDia(dia)}`;
  return formatearDia(dia);
}
