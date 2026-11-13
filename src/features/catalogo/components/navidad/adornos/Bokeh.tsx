import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { azar } from './azar';

interface BokehProps {
  cantidad: number;
  colores?: ColorToken[];
  /** `luces`: luces desenfocadas chicas, como detrás de una vidriera. `aurora`: dos o tres manchas enormes de luz */
  tipo?: 'luces' | 'aurora';
  semilla?: number;
}

/**
 * Luces desenfocadas detrás de todo: círculos de color con un borde muy difuso (una sombra de su mismo color) que
 * respiran despacio y se corren apenas. Dan profundidad. Con «reducir movimiento», quietas
 */
export function Bokeh({ cantidad, colores = ['accent', 'cinta', 'luzAzul', 'nieve'], tipo = 'luces', semilla = 0 }: BokehProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const [medida, setMedida] = useState({ ancho: 0, alto: 0 });
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== medida.ancho || layout.height !== medida.alto) setMedida({ ancho: layout.width, alto: layout.height });
  };
  const aurora = tipo === 'aurora';
  const base = aurora ? theme.opacity.aurora : theme.opacity.bokeh;

  return (
    <View onLayout={medir} style={styles.marco} aria-hidden>
      {medida.ancho > 0 &&
        Array.from({ length: cantidad }, (_, i) => {
          const n = i + semilla * 100;
          const lado = aurora ? theme.sizes.aurora * (0.8 + azar(n, 1) * 0.6) : theme.sizes.bokeh + azar(n, 1) * (theme.sizes.bokehGrande - theme.sizes.bokeh);
          const color = theme.colors[colores[i % colores.length]];
          const segundos = (aurora ? 9 : 5) + azar(n, 2) * 5;
          const respira: CSSAnimationKeyframes = {
            '0%': { opacity: base * 0.5, transform: [{ translateY: 0 }, { scale: 0.92 }] },
            '50%': { opacity: base, transform: [{ translateY: -theme.sizes.flotar * (aurora ? 3 : 1.5) }, { scale: 1.06 }] },
            '100%': { opacity: base * 0.5, transform: [{ translateY: 0 }, { scale: 0.92 }] },
          };
          return (
            <Animated.View
              key={i}
              style={[
                styles.luz,
                {
                  left: azar(n, 3) * medida.ancho - lado / 2,
                  top: azar(n, 4) * medida.alto - lado / 2,
                  width: lado,
                  height: lado,
                  opacity: base,
                  backgroundColor: color,
                  boxShadow: `0 0 ${lado / 2}px ${lado / 4}px ${color}`,
                },
                !calma && {
                  animationName: respira,
                  animationDuration: `${segundos}s`,
                  animationDelay: `${-azar(n, 5) * segundos}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                },
              ]}
            />
          );
        })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { ...StyleSheet.absoluteFill, overflow: 'hidden', pointerEvents: 'none' },
    luz: { position: 'absolute', borderRadius: theme.radius.full },
  });
