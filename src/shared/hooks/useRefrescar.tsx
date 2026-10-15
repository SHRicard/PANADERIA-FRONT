import { useEffect, useRef, useState, type ReactElement } from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';
import { useTheme } from '@/theme';

// Si la respuesta llega enseguida, la rueda igual se ve un momento: si no, parece que el gesto no hizo nada
const MINIMO_VISIBLE_MS = 600;

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

/**
 * El gesto de tirar para abajo. `refrescar` tiene que devolver la promesa: la rueda gira hasta que se cumple.
 * Se cuelga con `refreshControl={refresco.control}` en el FlatList, el ScrollView o el ScreenContainer.
 */
export function useRefrescar(refrescar: () => Promise<unknown>): {
  control: ReactElement<RefreshControlProps>;
  refrescando: boolean;
} {
  const theme = useTheme();
  const [refrescando, setRefrescando] = useState(false);
  const montado = useRef(true);

  useEffect(
    () => () => {
      montado.current = false;
    },
    []
  );

  const alRefrescar = async () => {
    setRefrescando(true);
    const inicio = Date.now();
    try {
      await refrescar();
    } catch {
      // El error lo muestra la pantalla con su propio estado de error
    }
    await esperar(MINIMO_VISIBLE_MS - (Date.now() - inicio));
    // Si la pantalla se cerró a mitad del refresh, no hay nada que actualizar
    if (montado.current) setRefrescando(false);
  };

  const control = (
    <RefreshControl
      refreshing={refrescando}
      onRefresh={alRefrescar}
      colors={[theme.colors.primary]}
      tintColor={theme.colors.primary}
      progressBackgroundColor={theme.colors.surface}
    />
  );

  return { control, refrescando };
}
