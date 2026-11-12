import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useStyles, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { azar } from './azar';

// Se mece colgado de su hilo, desde arriba; cada uno con su ritmo
const VAIVEN: CSSAnimationKeyframes = { from: { transform: [{ rotate: '-8deg' }] }, to: { transform: [{ rotate: '8deg' }] } };
// El destello que le salta encima cada tanto, como un reflejo en el vidrio
const REFLEJO: CSSAnimationKeyframes = {
  '0%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '0deg' }] },
  '5%': { opacity: 1, transform: [{ scale: 1 }, { rotate: '45deg' }] },
  '11%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '90deg' }] },
  '100%': { opacity: 0, transform: [{ scale: 0.2 }, { rotate: '90deg' }] },
};

/** Cuánto del alto de cada dibujo entra el hilo, para que quede atado al moño, a la argolla o al gancho */
const ENGANCHE: Partial<Record<NombreAssetNavidad, number>> = {
  esferaAzulMono: 0.22,
  esferaRojaCopo: 0.07,
  esferaNaranja: 0.08,
  campanaDorada: 0.12,
  galletaEstrella: 0.06,
  esferaCarita: 0.08,
};

export interface Colgante {
  /** Dónde cuelga, de 0 a 1 del ancho */
  x: number;
  nombre: NombreAssetNavidad;
  /** El largo del hilo, en múltiplos del lado del dibujo */
  hilo: number;
}

interface ColgantesProps {
  colgantes: Colgante[];
  /** El lado de cada dibujo (de `sizes`) */
  lado: number;
  /** Desde qué altura cuelgan (el borde de arriba, o el medio de una guirnalda) */
  desde?: number;
}

/**
 * Esferas, campanas o galletitas colgando de hilos dorados que se mecen, cada una a su ritmo, con un destello que les
 * salta encima cada tanto. Llenan el lugar de quien las pone, por encima, sin recibir toques. Quietas con «reducir
 * movimiento»
 */
export function Colgantes({ colgantes, lado, desde = 0 }: ColgantesProps) {
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const [ancho, setAncho] = useState(0);
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== ancho) setAncho(layout.width);
  };

  return (
    <View onLayout={medir} style={styles.marco} aria-hidden>
      {ancho > 0 &&
        colgantes.map(({ x, nombre, hilo }, i) => {
          const enganche = ENGANCHE[nombre] ?? 0.08;
          const segundos = 2.2 + azar(i, 11) * 1.2;
          const brillo = 4 + azar(i, 13) * 4;
          return (
            <Animated.View
              key={`${x}-${nombre}`}
              style={[
                styles.colgante,
                { left: x * ancho - lado / 2, top: desde, width: lado },
                !calma && {
                  animationName: VAIVEN,
                  animationDuration: `${segundos}s`,
                  animationDelay: `${-azar(i, 12) * segundos}s`,
                  animationDirection: 'alternate',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                },
              ]}
            >
              <View style={[styles.hilo, { height: lado * (hilo + enganche), marginBottom: -lado * enganche }]} />
              <View>
                <Ilustracion nombre={nombre} ancho={lado} />
                {!calma && (
                  <Animated.Text
                    style={[
                      styles.reflejo,
                      {
                        animationName: REFLEJO,
                        animationDuration: `${brillo}s`,
                        animationDelay: `${-azar(i, 14) * brillo}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'ease-in-out',
                      },
                    ]}
                  >
                    {'✦'}
                  </Animated.Text>
                )}
              </View>
            </Animated.View>
          );
        })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
    colgante: { position: 'absolute', alignItems: 'center', transformOrigin: 'top' },
    hilo: { width: 1, backgroundColor: theme.colors.accent },
    // Arriba a la izquierda del dibujo, donde pega la luz
    reflejo: {
      position: 'absolute',
      top: '22%',
      left: '18%',
      fontSize: theme.sizes.destello,
      lineHeight: theme.sizes.destello,
      fontFamily: theme.fonts.texto,
      color: theme.colors.nieve,
    },
  });
