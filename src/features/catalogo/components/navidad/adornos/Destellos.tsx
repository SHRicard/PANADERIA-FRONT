import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { azar } from './azar';

const DESTELLO = '✦';

// `chispa`: aparece de golpe girando y se va, y descansa un rato. `estrella`: titila sin parar, como en el cielo
const CHISPA: CSSAnimationKeyframes = {
  '0%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '0deg' }] },
  '6%': { opacity: 1, transform: [{ scale: 1 }, { rotate: '45deg' }] },
  '13%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '90deg' }] },
  '100%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '90deg' }] },
};
const ESTRELLA: CSSAnimationKeyframes = {
  '0%': { opacity: 0.25, transform: [{ scale: 0.7 }] },
  '50%': { opacity: 1, transform: [{ scale: 1.1 }] },
  '100%': { opacity: 0.25, transform: [{ scale: 0.7 }] },
};

interface DestellosProps {
  cantidad: number;
  color?: ColorToken;
  modo?: 'chispa' | 'estrella';
  /** Hasta qué alto (de 0 a 1) van: las estrellas, en el cielo de arriba */
  hasta?: number;
  /** Semilla: dos grupos de destellos no caen en los mismos lugares */
  semilla?: number;
}

/**
 * Destellos (✦) en lugares fijos de lo que llenan: chispas que aparecen girando de a una, o estrellas que titilan. Detrás
 * de todo, sin toques. Con «reducir movimiento», las estrellas quedan prendidas y las chispas no aparecen
 */
export function Destellos({ cantidad, color = 'nieve', modo = 'chispa', hasta = 1, semilla = 0 }: DestellosProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const [medida, setMedida] = useState({ ancho: 0, alto: 0 });
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== medida.ancho || layout.height !== medida.alto) setMedida({ ancho: layout.width, alto: layout.height });
  };
  if (calma && modo === 'chispa') return null;

  return (
    <View onLayout={medir} style={styles.marco} aria-hidden>
      {medida.ancho > 0 &&
        Array.from({ length: cantidad }, (_, i) => {
          const n = i + semilla * 100;
          const grande = azar(n, 2) > 0.7;
          const lado = grande ? theme.sizes.destelloGrande : theme.sizes.destello;
          const segundos = modo === 'chispa' ? 3.5 + azar(n, 3) * 4 : 1.8 + azar(n, 3) * 2.4;
          return (
            <Animated.Text
              key={i}
              style={[
                styles.destello,
                {
                  left: azar(n, 4) * (medida.ancho - lado),
                  top: azar(n, 5) * (medida.alto * hasta - lado),
                  fontSize: lado,
                  lineHeight: lado,
                  color: theme.colors[color],
                },
                !calma && {
                  animationName: modo === 'chispa' ? CHISPA : ESTRELLA,
                  animationDuration: `${segundos}s`,
                  animationDelay: `${-azar(n, 6) * segundos}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                },
              ]}
            >
              {DESTELLO}
            </Animated.Text>
          );
        })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { ...StyleSheet.absoluteFill, overflow: 'hidden', pointerEvents: 'none' },
    destello: { position: 'absolute', fontFamily: theme.fonts.texto },
  });
