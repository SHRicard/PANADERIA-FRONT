import type { DiaCalendario } from '@/shared/ui/atoms';
import { mesDeDia, semanasDelMes, sumarDias } from '@/shared/utils';
import type { EntregaDisponible } from './types';

/** El cartel de un día que el dueño marcó como lleno: corto, para que entre en la casilla del día */
export const AGENDA_LLENA = 'Llena';
/** El cartel de un día que se puede elegir: en verde, para que se vea de un vistazo qué días quedan */
export const DIA_LIBRE = 'Libre';
/** El de uno que se está llenando: se puede elegir, en amarillo. Corto para que entre; el lector de pantalla dice más */
export const DIA_CASI_LLENO = 'Casi';
const DIA_CASI_LLENO_ACCESIBLE = 'Casi lleno';
/** Lo que lee el lector de pantalla en ese día */
const AGENDA_LLENA_ACCESIBLE = 'Agenda llena';
/** Lo que ve el cliente si toca un día lleno */
export const MENSAJE_DIA_LLENO = 'Lo sentimos, ya no tenemos lugar para ese día. Te invitamos a elegir otro. ¡Gracias!';
/** El título de la hoja que se abre al tocar un día lleno */
export const TITULO_DIA_LLENO = 'Esta fecha ya está llena';

/** Si el día elegido sigue valiendo con la cotización de ahora (el carrito cambió, o el dueño llenó ese día) */
export function diaDisponible(dia: string, { desde, hasta, diasLlenos }: EntregaDisponible): boolean {
  return dia >= desde && dia <= hasta && !diasLlenos.includes(dia);
}

/**
 * Cómo se ve cada día del mes en el calendario del cliente: los de fuera del rango no se pueden tocar, los que puede
 * elegir van en verde con «Libre» (o en amarillo con «Casi» si se están llenando), y los llenos van en rojo y, al tocarlos, explican por qué no se pueden elegir
 */
export function diasDelCalendario(
  mes: string,
  { desde, hasta, diasLlenos, diasCasiLlenos }: EntregaDisponible,
): Record<string, DiaCalendario> {
  const dias: Record<string, DiaCalendario> = {};
  for (const dia of semanasDelMes(mes).flat()) {
    if (!dia) continue;
    if (diasLlenos.includes(dia)) dias[dia] = { aviso: AGENDA_LLENA, avisoAccesible: AGENDA_LLENA_ACCESIBLE, rechazo: MENSAJE_DIA_LLENO };
    else if (dia < desde || dia > hasta) dias[dia] = { deshabilitado: true };
    else if (diasCasiLlenos.includes(dia)) {
      dias[dia] = { aviso: DIA_CASI_LLENO, avisoAccesible: DIA_CASI_LLENO_ACCESIBLE, tono: 'atencion' };
    } else dias[dia] = { aviso: DIA_LIBRE, tono: 'exito' };
  }
  return dias;
}

/** Los meses entre los que se puede mover el calendario del cliente: el del primer día y el del último */
export function mesesDeLaEntrega({ desde, hasta }: EntregaDisponible) {
  return { primero: mesDeDia(desde), ultimo: mesDeDia(hasta) };
}

/** El día más cercano a `dia` que se puede elegir, yendo de a un día en `paso` (-1 antes, +1 después). null si no hay */
function diaCercano(dia: string, paso: 1 | -1, disponible: EntregaDisponible): string | null {
  for (let otro = sumarDias(dia, paso); otro >= disponible.desde && otro <= disponible.hasta; otro = sumarDias(otro, paso)) {
    if (diaDisponible(otro, disponible)) return otro;
  }
  return null;
}

/** Lo que se le ofrece al cliente que tocó un día lleno: el día libre más cercano antes y el más cercano después */
export function alternativasDeDia(dia: string, disponible: EntregaDisponible) {
  return { antes: diaCercano(dia, -1, disponible), despues: diaCercano(dia, 1, disponible) };
}
