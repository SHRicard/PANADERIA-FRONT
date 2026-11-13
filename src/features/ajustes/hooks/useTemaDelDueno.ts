import { useEffect } from 'react';
import { useThemeMode } from '@/theme';
import { useObtenerAjustesQuery } from '../api/ajustesApi';

/**
 * El tema (claro u oscuro) es el que eligió el dueño en su app: se guarda en el back y lo siguen todos. En la web, cada
 * cliente ve lo mismo que el dueño; en la APK, si el dueño lo cambió desde otro celular, se acomoda solo. Mientras no
 * llegan los ajustes (o si el back no responde) queda el último que se vio en ese aparato. Lo monta el layout raíz.
 * Es la misma consulta que el cartel de cerrado: no suma pedidos
 */
export function useTemaDelDueno(): void {
  const { data } = useObtenerAjustesQuery();
  const { preferencia, cambiarPreferencia } = useThemeMode();
  const tema = data?.tema;

  useEffect(() => {
    if (tema && tema !== preferencia) cambiarPreferencia(tema);
    // Solo cuando cambia lo que dice el back: el cambio en la app lo manda el dueño (y el back responde lo mismo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema]);
}
