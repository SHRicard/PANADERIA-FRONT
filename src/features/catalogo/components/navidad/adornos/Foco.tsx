import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { azar } from './azar';

/**
 * Cómo parpadea un foquito. Tres maneras, para que nunca titilen todos igual: se apaga de golpe y vuelve, tiembla dos
 * veces seguidas, o respira despacio. Cada uno además con su ritmo y su arranque
 */
const PARPADEOS: CSSAnimationKeyframes[] = [
  { '0%': { opacity: 1 }, '5%': { opacity: 0.2 }, '9%': { opacity: 1 }, '55%': { opacity: 1 }, '58%': { opacity: 0.35 }, '62%': { opacity: 1 }, '100%': { opacity: 1 } },
  { '0%': { opacity: 0.85 }, '30%': { opacity: 1 }, '33%': { opacity: 0.15 }, '36%': { opacity: 0.9 }, '40%': { opacity: 0.2 }, '45%': { opacity: 1 }, '100%': { opacity: 0.85 } },
  { '0%': { opacity: 1 }, '50%': { opacity: 0.4 }, '100%': { opacity: 1 } },
];
const PARPADEO_S = 2.6;
const PARPADEO_EXTRA_S = 2.8;

// La onda: un golpe de luz que recorre la guirnalda de punta a punta (cada foquito un poco después que el anterior).
// El halo se agranda y se enciende, y vuelve
const ONDA: CSSAnimationKeyframes = {
  '0%': { opacity: 0.35, transform: [{ scale: 0.8 }] },
  '10%': { opacity: 1, transform: [{ scale: 2 }] },
  '28%': { opacity: 0.4, transform: [{ scale: 0.9 }] },
  '100%': { opacity: 0.35, transform: [{ scale: 0.8 }] },
};
const ONDA_S = 3.4;
const PASO_ONDA_S = 0.07;

export const COLORES_FOCO: ColorToken[] = ['cinta', 'accent', 'luzAzul', 'nieve', 'pino'];

interface FocoProps {
  color: ColorToken;
  /** Su lugar en la guirnalda: por ahí pasa la onda */
  indice: number;
  /** Para dónde apunta (el casquillo arriba): «0deg» cuelga, «180deg» apunta para arriba */
  giro?: string;
}

/**
 * Un foquito de Navidad hecho con Views: el casquillo, la ampolla de su color con un reflejo blanco (se ve de vidrio) y
 * un halo de la misma luz detrás. La ampolla parpadea a su manera y el halo se agranda cuando pasa la onda: así la
 * guirnalda tiene vida. Con «reducir movimiento», quedan todos prendidos
 */
export function Foco({ color, indice, giro = '0deg' }: FocoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const luz = theme.colors[color];
  const parpadeo = PARPADEOS[Math.floor(azar(indice, 31) * PARPADEOS.length)];
  const segundos = PARPADEO_S + azar(indice, 37) * PARPADEO_EXTRA_S;
  const fase = (indice * PASO_ONDA_S) % ONDA_S;

  return (
    <View style={[styles.foco, { transform: [{ rotate: giro }] }]} aria-hidden>
      <Animated.View
        style={[
          styles.halo,
          { backgroundColor: luz, boxShadow: `0 0 ${theme.spacing.md}px ${theme.spacing.xs}px ${luz}` },
          !calma && {
            animationName: ONDA,
            animationDuration: `${ONDA_S}s`,
            animationDelay: `${fase - ONDA_S}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
          },
        ]}
      />
      <View style={styles.casquillo} />
      <Animated.View
        style={[
          styles.ampolla,
          { backgroundColor: luz },
          !calma && {
            animationName: parpadeo,
            animationDuration: `${segundos}s`,
            animationDelay: `${-azar(indice, 41) * segundos}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          },
        ]}
      >
        <View style={styles.reflejo} />
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) => {
  const { haloFoquito, foquito, foquitoLargo, casquilloFoquito } = theme.sizes;
  return StyleSheet.create({
    // Gira desde el casquillo: arriba al medio
    foco: { width: haloFoquito, height: haloFoquito, alignItems: 'center', transformOrigin: 'top' },
    halo: {
      position: 'absolute',
      top: casquilloFoquito + foquitoLargo / 2 - foquito / 2,
      left: (haloFoquito - foquito) / 2,
      width: foquito,
      height: foquito,
      borderRadius: theme.radius.full,
      opacity: 0.3,
    },
    casquillo: {
      width: casquilloFoquito,
      height: casquilloFoquito,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
      backgroundColor: theme.colors.pinoOscuro,
    },
    ampolla: { width: foquito, height: foquitoLargo, borderRadius: theme.radius.full, overflow: 'hidden' },
    // El reflejo del vidrio, arriba a la izquierda
    reflejo: {
      position: 'absolute',
      top: theme.spacing.xxs,
      left: theme.spacing.xxs / 2,
      width: foquito / 3,
      height: foquitoLargo / 3,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.nieve,
      opacity: 0.8,
    },
  });
};
