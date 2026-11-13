import { useEstiloCatalogo, type EstiloCatalogo } from '@/features/catalogo';
import { useCierre } from '@/features/cierre';

/** Lo que se elige en Preferencias → Web: un estilo del catálogo, o la web cerrada con el cartel */
export type OpcionWeb = EstiloCatalogo | 'cerrado';

/**
 * Preferencias → Web: cómo ven la web los clientes. Un estilo del catálogo (Vidriera, Carta, Navidad de día o Navidad
 * de noche, los de ESTILOS_CATALOGO) o Cerrado (el cartel en lugar del catálogo, sin pedidos). Todo se guarda en el
 * back, en los ajustes. Cerrar no pisa el estilo: al elegir de nuevo un estilo, la web se abre con ese
 */
export function usePreferenciaWeb() {
  const catalogo = useEstiloCatalogo();
  const cierre = useCierre();
  const opcion: OpcionWeb = cierre.cerrado ? 'cerrado' : catalogo.estilo;

  return {
    opcion,
    // Las dos salen de la misma consulta (GET /api/ajustes): carga, falla y se refresca una sola vez
    cargando: catalogo.cargando,
    error: catalogo.error,
    reintentar: catalogo.reintentar,
    refrescar: catalogo.refrescar,
    errorAlCambiar: catalogo.errorAlCambiar ?? cierre.errorAlCambiar,
    elegir: (nueva: OpcionWeb) => {
      if (nueva === opcion) return;
      if (nueva === 'cerrado') {
        cierre.cerrar();
        return;
      }
      // Con la web cerrada, elegir un estilo la abre con ese estilo, en un solo cambio
      if (cierre.cerrado) void cierre.abrir({ estiloCatalogo: nueva });
      else void catalogo.cambiar(nueva);
    },
    mensaje: cierre.mensaje,
  };
}
