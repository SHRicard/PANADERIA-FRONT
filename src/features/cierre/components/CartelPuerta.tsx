import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { CartelProps } from '../types';
import { PanDibujado, type CualPan } from './PanDibujado';

// El frente del local, en unidades: 240 × 250. El toldo a rayas arriba, una ventana a cada lado y la puerta al medio.
// Se muestra desde y = 24 (justo arriba del toldo): lo de más arriba es aire
const ANCHO = 240;
const ALTO = 250;
const ARRIBA = 24;
const ALTO_VISIBLE = ALTO - ARRIBA;
const TOLDO_X = 10;
const TOLDO_ANCHO = 220;
const FRANJAS = Array.from({ length: 8 }, (_, i) => i);
const FRANJA = TOLDO_ANCHO / FRANJAS.length;
// Las ventanas, con un producto adentro con la luz apagada. El producto, a 0,8 y centrado
const VENTANAS: { x: number; cual: CualPan }[] = [
  { x: 32, cual: 'pan' },
  { x: 162, cual: 'medialuna' },
];
const VENTANA_ANCHO = 46;
const ESCALA_PAN = 0.8;
// El clavo del que cuelga el cartelito, en el vidrio de la puerta
const CLAVO = { x: 120, y: 112 };
// El cartelito ocupa el 40% del ancho, centrado en el clavo
const CARTELITO_ANCHO = 0.4;

// El vaivén del cartelito: hasta 4° para cada lado, ida y vuelta en 3,6 s
const VAIVEN_GRADOS = 4;
const VAIVEN_MS = 1800;

/** El cartelito de «Cerrado» colgado del clavo: se mece despacio (quieto con «reducir movimiento») */
function Cartelito() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const vaiven = useSharedValue(0);

  useEffect(() => {
    if (calma) {
      vaiven.value = 0;
      return;
    }
    vaiven.value = -1;
    vaiven.value = withRepeat(
      withTiming(1, { duration: VAIVEN_MS, easing: Easing.inOut(Easing.sin), reduceMotion: ReduceMotion.Never }),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    return () => cancelAnimation(vaiven);
  }, [vaiven, calma]);

  const estilo = useAnimatedStyle(() => ({ transform: [{ rotate: `${vaiven.value * VAIVEN_GRADOS}deg` }] }));

  return (
    <Animated.View style={[styles.cartelito, estilo]}>
      {/* El hilo, del clavo a las dos puntas de la placa */}
      <View style={styles.hilo}>
        <Svg viewBox="0 0 96 22" width="100%" height="100%">
          <Path d="M14 21 L48 1 L82 21" fill="none" stroke={theme.colors.textMuted} strokeWidth={1.4} strokeLinejoin="round" />
          <Circle cx={14} cy={21} r={2.2} fill={theme.colors.panCorte} />
          <Circle cx={82} cy={21} r={2.2} fill={theme.colors.panCorte} />
        </Svg>
      </View>
      <View style={styles.placa}>
        <Text variant="subtitle" color="danger" style={styles.cerrado}>
          Cerrado
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          Volvemos pronto
        </Text>
      </View>
    </Animated.View>
  );
}

/**
 * El cartel de negocio cerrado: el frente del local con el toldo a rayas, las ventanas con la luz apagada y el
 * cartelito de «Cerrado» colgado en la puerta. Abajo, el título, la línea dorada y el mensaje del dueño. Es la opción
 * «Puerta» que eligió el dueño (2026-11-05), entre «Persiana» y «Nota»
 */
export function CartelPuerta({ mensaje, pie }: CartelProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const c = theme.colors;

  return (
    <View style={styles.cartel}>
      <View style={styles.frente} aria-hidden>
        <Svg viewBox={`0 ${ARRIBA} ${ANCHO} ${ALTO_VISIBLE}`} width="100%" height="100%">
          {/* La pared */}
          <Rect x={18} y={40} width={204} height={196} fill={c.primarySoft} stroke={c.border} strokeWidth={1.5} />

          {/* Las ventanas, con un producto adentro y la luz apagada */}
          {VENTANAS.map(({ x, cual }) => (
            <G key={x}>
              <Rect x={x} y={100} width={VENTANA_ANCHO} height={58} rx={4} fill={c.surface} stroke={c.primary} strokeWidth={3} />
              <Line x1={x} y1={118} x2={x + VENTANA_ANCHO} y2={118} stroke={c.primary} strokeWidth={1.5} />
              <PanDibujado
                cual={cual}
                x={x + VENTANA_ANCHO / 2 - 25 * ESCALA_PAN}
                y={155 - 42.5 * ESCALA_PAN}
                escala={ESCALA_PAN}
                apagado
              />
              <Rect x={x - 3} y={157} width={VENTANA_ANCHO + 6} height={5} rx={1.5} fill={c.primary} />
            </G>
          ))}

          {/* La puerta: el marco, la hoja, el vidrio, los dos paneles y el picaporte */}
          <Path d="M86 236 V120 A34 34 0 0 1 154 120 V236" fill="none" stroke={c.primaryPressed} strokeWidth={3} />
          <Path d="M92 236 V120 A28 28 0 0 1 148 120 V236 Z" fill={c.primary} />
          <Path d="M100 152 V122 A20 20 0 0 1 140 122 V152 Z" fill={c.surfaceMuted} stroke={c.primaryPressed} strokeWidth={1.5} />
          <Rect x={100} y={162} width={40} height={28} rx={2} fill="none" stroke={c.primaryPressed} strokeWidth={1.5} />
          <Rect x={100} y={196} width={40} height={32} rx={2} fill="none" stroke={c.primaryPressed} strokeWidth={1.5} />
          <Circle cx={144} cy={193} r={2.6} fill={c.accent} />
          <Circle cx={CLAVO.x} cy={CLAVO.y} r={2.4} fill={c.panCorte} />

          {/* El toldo: la barra y las franjas, con la punta redonda */}
          <Rect x={TOLDO_X - 2} y={30} width={TOLDO_ANCHO + 4} height={10} rx={3} fill={c.primary} />
          {FRANJAS.map((i) => {
            const x = TOLDO_X + i * FRANJA;
            return (
              <Path
                key={i}
                d={`M${x} 40 H${x + FRANJA} V62 A${FRANJA / 2} ${FRANJA / 2} 0 0 1 ${x} 62 Z`}
                fill={i % 2 === 0 ? c.accent : c.surface}
                stroke={c.border}
                strokeWidth={1}
              />
            );
          })}

          {/* El escalón y la vereda */}
          <Rect x={80} y={234} width={80} height={6} rx={1.5} fill={c.surfaceMuted} stroke={c.border} strokeWidth={1} />
          <Rect x={0} y={240} width={ANCHO} height={6} rx={3} fill={c.border} />
        </Svg>
        <Cartelito />
      </View>

      <View style={styles.textos}>
        <Text variant="overline" color="textMuted" align="center">
          Dama Blanca · Horneados
        </Text>
        <Text variant="display" align="center">
          Cerramos por unos días
        </Text>
        <Adorno forma="corto" />
        <Text color="textMuted" align="center">
          {mensaje}
        </Text>
      </View>
      {pie}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cartel: { width: '100%', alignItems: 'center', gap: theme.spacing.xl },
    frente: { width: '100%', maxWidth: theme.sizes.cartelCerrado, aspectRatio: ANCHO / ALTO_VISIBLE },
    cartelito: {
      position: 'absolute',
      top: `${((CLAVO.y - ARRIBA) / ALTO_VISIBLE) * 100}%` as const,
      left: `${(CLAVO.x / ANCHO - CARTELITO_ANCHO / 2) * 100}%` as const,
      width: `${CARTELITO_ANCHO * 100}%` as const,
      // Se mece desde el clavo
      transformOrigin: 'top',
    },
    hilo: { width: '100%', aspectRatio: 96 / 22 },
    placa: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      borderWidth: 2,
      borderColor: theme.colors.danger,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
    },
    cerrado: { textTransform: 'uppercase', letterSpacing: theme.text.overline.letterSpacing },
    textos: { width: '100%', maxWidth: theme.sizes.formMax, gap: theme.spacing.md },
  });
