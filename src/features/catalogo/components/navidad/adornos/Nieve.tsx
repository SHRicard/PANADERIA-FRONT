import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useStyles, useTheme, type Theme } from '@/theme';
import { azar } from './azar';

type Capa = 'lejos' | 'medio' | 'cerca';

// Cada capa: cuántos copos de cada cien, cuánto tarda en cruzar (los de lejos, despacio) y qué tan transparente.
// Juntas dan profundidad: la nieve de cerca es grande, rápida y se ve más
const CAPAS: Record<Capa, { parte: number; segundos: number; extra: number; luz: number; semilla: number }> = {
  lejos: { parte: 0.5, segundos: 16, extra: 8, luz: 0.45, semilla: 1 },
  medio: { parte: 0.32, segundos: 11, extra: 5, luz: 0.75, semilla: 2 },
  cerca: { parte: 0.18, segundos: 7, extra: 3, luz: 1, semilla: 3 },
};

interface NieveProps {
  /** Cuántos copos en total, repartidos entre las tres capas */
  cantidad: number;
  /** Que caiga. Sin esto, queda quieta */
  cae?: boolean;
  /** Con un contorno de sombra apenas visible: sobre un fondo claro, la nieve blanca no se vería */
  contorno?: boolean;
}

/**
 * Nieve en tres capas (lejos, al medio y cerca), hecha con círculos del color `nieve`, que llena el lugar de quien la
 * pone (`position: relative`) detrás de todo. Cada copo baja con su vaivén y arranca en otro punto de su caída, así ya
 * hay nieve en todo el alto desde el principio. Con «reducir movimiento», quieta
 */
export function Nieve({ cantidad, cae = true, contorno = false }: NieveProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const [medida, setMedida] = useState({ ancho: 0, alto: 0 });
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== medida.ancho || layout.height !== medida.alto) setMedida({ ancho: layout.width, alto: layout.height });
  };
  const { ancho, alto } = medida;
  const anima = cae && !calma;
  const lados: Record<Capa, number> = { lejos: theme.sizes.copoLejos, medio: theme.sizes.copoMedio, cerca: theme.sizes.copoCerca };

  return (
    <View onLayout={medir} style={styles.marco} aria-hidden>
      {alto > 0 &&
        (Object.keys(CAPAS) as Capa[]).flatMap((capa) => {
          const { parte, segundos: base, extra, luz, semilla } = CAPAS[capa];
          const lado = lados[capa];
          return Array.from({ length: Math.round(cantidad * parte) }, (_, i) => {
            const n = i + semilla * 1000;
            const copo = {
              left: azar(n, 2) * ancho,
              width: lado,
              height: lado,
              opacity: theme.opacity.nieve * luz * (0.7 + azar(n, 3) * 0.3),
              ...(contorno && { boxShadow: `0 0 ${theme.spacing.xxs}px ${theme.colors.contornoNieve}` }),
            };
            if (!anima) return <View key={`${capa}${i}`} style={[styles.copo, copo, { top: azar(n, 4) * alto }]} />;
            const vaiven = (theme.spacing.sm + azar(n, 5) * theme.spacing.lg) * (capa === 'cerca' ? 1.6 : 1);
            const segundos = base + azar(n, 6) * extra;
            const caida: CSSAnimationKeyframes = {
              '0%': { transform: [{ translateY: -lado }, { translateX: 0 }] },
              '50%': { transform: [{ translateY: alto * 0.5 }, { translateX: vaiven }] },
              '100%': { transform: [{ translateY: alto + lado }, { translateX: 0 }] },
            };
            return (
              <Animated.View
                key={`${capa}${i}`}
                style={[
                  styles.copo,
                  copo,
                  capa === 'cerca' && { boxShadow: `0 0 ${lado}px ${theme.colors.nieve}` },
                  {
                    animationName: caida,
                    animationDuration: `${segundos}s`,
                    animationDelay: `${-azar(n, 7) * segundos}s`,
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear',
                  },
                ]}
              />
            );
          });
        })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { ...StyleSheet.absoluteFill, overflow: 'hidden', pointerEvents: 'none' },
    copo: { position: 'absolute', top: theme.spacing.none, borderRadius: theme.radius.full, backgroundColor: theme.colors.nieve },
  });
