import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useTheme, type Theme } from '@/theme';

/**
 * Cómo se mueve algo que está vivo: `flotar` sube y baja; `mecer` se balancea colgado de arriba; `saludar` se menea
 * desde abajo y descansa; `latir` crece apenas y vuelve; `saltar` da dos saltitos y descansa
 */
export type Movimiento = 'flotar' | 'mecer' | 'saludar' | 'latir' | 'saltar';

const MOVIMIENTOS = (theme: Theme): Record<Movimiento, { cuadros: CSSAnimationKeyframes; segundos: number; desde?: 'top' | 'bottom'; ida?: boolean }> => ({
  flotar: {
    cuadros: { '0%': { transform: [{ translateY: 0 }] }, '50%': { transform: [{ translateY: -theme.sizes.flotar }] }, '100%': { transform: [{ translateY: 0 }] } },
    segundos: 3.4,
  },
  mecer: {
    cuadros: { from: { transform: [{ rotate: '-7deg' }] }, to: { transform: [{ rotate: '7deg' }] } },
    segundos: 2.4,
    desde: 'top',
    ida: true,
  },
  saludar: {
    cuadros: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '8%': { transform: [{ rotate: '-9deg' }] },
      '16%': { transform: [{ rotate: '7deg' }] },
      '24%': { transform: [{ rotate: '-6deg' }] },
      '32%': { transform: [{ rotate: '4deg' }] },
      '40%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '0deg' }] },
    },
    segundos: 4.2,
    desde: 'bottom',
  },
  latir: {
    cuadros: { '0%': { transform: [{ scale: 1 }] }, '50%': { transform: [{ scale: 1.05 }] }, '100%': { transform: [{ scale: 1 }] } },
    segundos: 3,
  },
  saltar: {
    cuadros: {
      '0%': { transform: [{ translateY: 0 }] },
      '7%': { transform: [{ translateY: -theme.sizes.flotar * 1.8 }] },
      '14%': { transform: [{ translateY: 0 }] },
      '19%': { transform: [{ translateY: -theme.sizes.flotar * 0.7 }] },
      '24%': { transform: [{ translateY: 0 }] },
      '100%': { transform: [{ translateY: 0 }] },
    },
    segundos: 3.8,
    desde: 'bottom',
  },
});

interface VivoProps {
  como: Movimiento;
  /** De 0 a 1: en qué punto de su movimiento arranca (así dos vecinos no se mueven a la par) */
  fase?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Le da vida a un dibujo (un personaje, el logo, una ramita): un movimiento suave que se repite. Quieto con «reducir movimiento» */
export function Vivo({ como, fase = 0, style, children }: VivoProps) {
  const theme = useTheme();
  const calma = useReducedMotion();
  const { cuadros, segundos, desde, ida } = MOVIMIENTOS(theme)[como];

  return (
    <Animated.View
      style={[
        style,
        desde && { transformOrigin: desde },
        !calma && {
          animationName: cuadros,
          animationDuration: `${segundos}s`,
          animationDelay: `${-fase * segundos}s`,
          animationIterationCount: 'infinite',
          animationDirection: ida ? 'alternate' : 'normal',
          animationTimingFunction: 'ease-in-out',
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
