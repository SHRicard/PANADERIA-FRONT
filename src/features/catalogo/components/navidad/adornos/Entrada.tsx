import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useTheme } from '@/theme';

// Las primeras entran de a una; de la doce en adelante, todas juntas (no hace esperar al que baja rápido)
const MAXIMO_ESCALONADO = 12;
const PASO_S = 0.06;

/**
 * Hace entrar lo de adentro (una fila de la carta) desde un poco más abajo, apareciendo, y escalonado según `indice`: el catálogo
 * se arma solo al cargar. Con «reducir movimiento», aparece de una
 */
export function Entrada({ indice, children }: { indice: number; children: ReactNode }) {
  const theme = useTheme();
  const calma = useReducedMotion();
  if (calma) return <View style={styles.lleno}>{children}</View>;

  const entra: CSSAnimationKeyframes = {
    from: { opacity: 0, transform: [{ translateY: theme.spacing.lg }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
  };
  return (
    <Animated.View
      style={[
        styles.lleno,
        {
          animationName: entra,
          animationDuration: '0.55s',
          animationDelay: `${Math.min(indice, MAXIMO_ESCALONADO) * PASO_S}s`,
          animationFillMode: 'both',
          animationTimingFunction: 'ease-out',
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Sin tokens: ocupa todo el lugar de lo que envuelve
const styles = StyleSheet.create({
  lleno: { flexGrow: 1 },
});
