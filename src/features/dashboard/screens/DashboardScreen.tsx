import { AvisoWebCerrada, useEstadoNegocio } from '@/features/cierre';
import { PantallaPestana } from '@/features/navegacion';
import { AgendaPedidos, useAgenda } from '@/features/pedidos';
import { useRefrescar } from '@/shared/hooks';
import { BotonesCatalogo } from '../components/BotonesCatalogo';

// Inicio del admin: si la web está cerrada (para que no se olvide de abrirla), los botones para compartir y ver el catálogo
// y la agenda (el mes con sus colores y, abajo, lo que hay que entregar el día elegido, que arranca en hoy). Al tirar
// para abajo se recarga todo: el otro admin pudo haber abierto o cerrado la web, y los pedidos de la web no avisan
export function DashboardScreen() {
  const agenda = useAgenda();
  const negocio = useEstadoNegocio();
  const refresco = useRefrescar(() => Promise.all([agenda.refrescar(), negocio.refrescar()]));

  return (
    <PantallaPestana pestana="dashboard" refreshControl={refresco.control} llenarAlto>
      <AvisoWebCerrada />
      <BotonesCatalogo />
      <AgendaPedidos agenda={agenda} refrescando={refresco.refrescando} />
    </PantallaPestana>
  );
}
