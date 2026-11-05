import { useObtenerAjustesQuery } from '@/features/ajustes';
import { mensajeDeError } from '@/services/api';
import { mensajeParaMostrar } from '../textos';

/**
 * Si el dueño cerró el negocio por un tiempo, y qué les dice a los clientes. Sale de los ajustes (GET /api/ajustes,
 * público), la misma consulta que el estilo del catálogo. `cerrado` es solo lo que guardó el dueño; si el back no
 * respondió, lo dice `sinRespuesta` y cada uno decide (la web muestra el cartel; el inicio del dueño, nada).
 *
 * ⚠️ Con la consulta en error, cada componente nuevo que la usa la vuelve a pedir (RTK Query reintenta al suscribirse),
 * y mientras tanto vuelve a «cargando». Por eso el cartel de la web recibe el mensaje por props y no llama a este hook:
 * si no, el cartel se monta, la pide de nuevo, la pantalla vuelve a cargar, el cartel se desmonta, y así sin parar
 */
export function useEstadoNegocio() {
  const consulta = useObtenerAjustesQuery();
  const ajustes = consulta.data;

  return {
    cargando: consulta.isLoading,
    cerrado: ajustes?.cerrado ?? false,
    /** El back no respondió (caído, dormido más de lo que se espera, sin conexión) y no hay ajustes de antes */
    sinRespuesta: consulta.isError && !ajustes,
    /** Por qué no respondió, para el aviso en desarrollo */
    error: consulta.isError ? mensajeDeError(consulta.error) : null,
    /** Lo que escribió el dueño o, si no escribió nada o el back no respondió, el de por defecto */
    mensaje: mensajeParaMostrar(ajustes?.mensajeCerrado ?? ''),
    refrescar: async () => {
      await consulta.refetch();
    },
  };
}
