import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { VistaLogs } from '../textos';
import type { IpLog } from '../types';
import { useIpsLogs } from './useIpsLogs';
import { usePeticionesLogs } from './usePeticionesLogs';
import { useResumenLogs } from './useResumenLogs';
import { useVisitasLogs } from './useVisitasLogs';

/** La IP que se está mirando: la IP para el back y el nombre que le puso el dueño, para mostrarla */
export interface IpFiltrada {
  ip: string;
  nombre: string | null;
}

/**
 * Más → Logs: el resumen arriba y, abajo, las visitas, las peticiones sueltas o las IP. Desde una IP se salta a sus
 * visitas, y esa IP queda filtrando las visitas y las peticiones hasta «Limpiar». Cada lista se pide recién al abrir
 * su vista; `refrescar` y `cargarMas` van a la que se está mirando
 */
export function useLogs() {
  const router = useRouter();
  const [vista, setVista] = useState<VistaLogs>('visitas');
  const [ip, setIp] = useState<IpFiltrada | null>(null);

  const resumen = useResumenLogs();
  const visitas = useVisitasLogs(ip, vista === 'visitas');
  const peticiones = usePeticionesLogs(ip, vista === 'peticiones');
  const ips = useIpsLogs(vista === 'ips');
  const activa = { visitas, peticiones, ips }[vista];

  return {
    vista,
    setVista,
    resumen,
    visitas,
    peticiones,
    ips,
    refrescar: async () => {
      await Promise.all([resumen.refrescar(), activa.refrescar()]);
    },
    cargarMas: activa.cargarMas,

    /** La IP que filtra las visitas y las peticiones */
    ip,
    limpiarIp: () => setIp(null),
    /** Desde la tarjeta de una IP: sus visitas, todas */
    verVisitasDe: (elegida: IpLog) => {
      setIp({ ip: elegida.ip, nombre: elegida.nombre });
      visitas.setFiltro('todas');
      setVista('visitas');
    },
    abrirPedido: (id: string) => router.push({ pathname: '/pedidos/[id]', params: { id } }),
  };
}
