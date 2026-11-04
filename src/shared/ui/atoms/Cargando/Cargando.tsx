import { memo, useEffect, useId, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { Text } from '../Text';

type Tamano = 'normal' | 'chico';

export interface CargandoProps {
  /**
   * `normal`: ocupa el lugar de lo que carga, solo el dibujo. `chico`: en una línea, con el texto al lado (adentro de
   * un botón, «Cargando más pedidos»)
   */
  tamano?: Tamano;
  /**
   * Qué se está cargando («Cargando pedidos…»). En el normal no se muestra (el dueño lo prefiere solo con el dibujo):
   * lo lee el lector de pantalla. En el chico va al lado
   */
  mensaje?: string;
  /** De un solo color, con el relleno translúcido. Para un fondo donde el dorado se perdería (adentro de un botón) */
  color?: ColorToken;
  /**
   * Ocupa todo el alto que le queda a la pantalla y se centra ahí, a lo alto y a lo ancho: cuando lo que carga es la
   * pantalla entera (o todo lo que va debajo del encabezado). Lo que lo contiene tiene que crecer: el
   * `ScreenContainer` (o `PantallaPestana`) con `llenarAlto`, y cada View del medio con `flexGrow: 1`
   */
  llenarAlto?: boolean;
  style?: StyleProp<ViewStyle>;
}

// La vidriera: una cinta con un pan, una medialuna y un alfajor que pasan de derecha a izquierda, sin cortarse.
// Todo se dibuja en unidades: la ventana mide 150 × 50 y cada producto va en una casilla de 50 × 50, apoyado en la
// cinta (y = 44). Hay seis casillas (dos tandas iguales) que dan la vuelta entera: 300 unidades
const VENTANA = 150;
const CASILLA = 50;
const LARGO = 300;
const CASILLAS = [0, 1, 2, 3, 4, 5];
// Cada producto tarda 4,2 s en cruzar la vidriera: la vuelta entera, el doble
const VUELTA_MS = 8400;
// Con «reducir movimiento» del sistema la cinta sigue, pero despacio: si se queda quieta, parece colgado
const VUELTA_CALMA_MS = VUELTA_MS * 3;
// Cada producto se mece un poquito mientras pasa: 12 veces por vuelta (entero, así no salta al empezar otra)
const BOTES_POR_VUELTA = 12;
const BOTE = 2;
// Dónde se desvanecen los bordes de la vidriera, según el centro de cada producto
const BORDES = [0, 33, VENTANA - 33, VENTANA];

// Los dibujos, en unidades de la casilla
const PAN = 'M9 41 C9 25 41 25 41 41 Q41 42.5 39 42.5 L11 42.5 Q9 42.5 9 41 Z';
const PAN_CORTES = 'M19 31 l3 4.4 M26.5 29.5 l3 4.6';
const PAN_BRILLO = 'M13 36 C14 32 17 30 20.5 29.4';
const MEDIALUNA = 'M6 41 C9 24 41 24 44 41 C38 37 12 37 6 41 Z';
const MEDIALUNA_CAPAS = 'M17.5 39 Q16 35 16.8 31 M25 38.6 Q24 33 25 28.6 M32.5 39 Q34 35 33.2 31';

// Los trazos, en unidades: en el chico (un tercio de ancho) más gruesos, para que se lean
interface Trazos {
  corte: number;
  contorno: number;
  galleta: number;
  cinta: number;
}
const TRAZOS: Record<Tamano, Trazos> = {
  normal: { corte: 1.6, contorno: 1.2, galleta: 1, cinta: 2 },
  chico: { corte: 3.2, contorno: 3, galleta: 2.6, cinta: 3.4 },
};

/** Con qué se pinta: los colores del pan, o un solo color con el relleno translúcido */
interface Pintura {
  miga: string;
  corte: string;
  galleta: string;
  /** El brillo de arriba del pan: solo con los colores del pan y en el normal (en el chico no se ve) */
  brillo: string | null;
  relleno?: number;
  /** De un solo color, el pan necesita contorno: sin él, el relleno translúcido no se lee */
  contorno: boolean;
}

function Producto({ cual, pintura, trazos }: { cual: number; pintura: Pintura; trazos: Trazos }) {
  if (cual === 0) {
    return (
      <>
        <Path
          d={PAN}
          fill={pintura.miga}
          fillOpacity={pintura.relleno}
          stroke={pintura.contorno ? pintura.corte : 'none'}
          strokeWidth={trazos.contorno}
          strokeLinejoin="round"
        />
        {pintura.brillo && <Path d={PAN_BRILLO} fill="none" stroke={pintura.brillo} strokeWidth={1.4} strokeLinecap="round" />}
        <Path d={PAN_CORTES} fill="none" stroke={pintura.corte} strokeWidth={trazos.corte} strokeLinecap="round" />
      </>
    );
  }
  if (cual === 1) {
    return (
      <>
        <Path
          d={MEDIALUNA}
          fill={pintura.miga}
          fillOpacity={pintura.relleno}
          stroke={pintura.corte}
          strokeWidth={trazos.contorno}
          strokeLinejoin="round"
        />
        <Path d={MEDIALUNA_CAPAS} fill="none" stroke={pintura.corte} strokeWidth={trazos.contorno} strokeLinecap="round" />
      </>
    );
  }
  // El alfajor: dos galletitas con el dulce de leche en el medio
  return (
    <>
      <Rect x={9} y={30} width={32} height={6.5} rx={3.25} fill={pintura.galleta} fillOpacity={pintura.relleno} stroke={pintura.corte} strokeWidth={trazos.galleta} />
      <Rect x={11} y={36.2} width={28} height={2.6} rx={1.3} fill={pintura.corte} />
      <Rect x={9} y={38.4} width={32} height={4.4} rx={2.2} fill={pintura.galleta} fillOpacity={pintura.relleno} stroke={pintura.corte} strokeWidth={trazos.galleta} />
    </>
  );
}

interface CasillaProps {
  orden: number;
  avance: SharedValue<number>;
  /** Cuántos px mide una unidad */
  escala: number;
  children: ReactNode;
}

/** Una casilla de la cinta: dónde va, cuánto se ve (los bordes se desvanecen) y cuánto se mece */
function Casilla({ orden, avance, escala, children }: CasillaProps) {
  const lado = CASILLA * escala;
  const estilo = useAnimatedStyle(() => {
    // Su borde izquierdo, de 250 (todavía afuera, a la derecha) a −50 (ya salió por la izquierda)
    const x = ((((orden * CASILLA - avance.value * LARGO) % LARGO) + LARGO) % LARGO) - CASILLA;
    const bote = (Math.sin((avance.value * BOTES_POR_VUELTA + (orden % 3) / 3) * 2 * Math.PI) + 1) / 2;
    return {
      opacity: interpolate(x + CASILLA / 2, BORDES, [0, 1, 1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: x * escala }, { translateY: -bote * BOTE * escala }],
    };
  });

  return <Animated.View style={[styles.casilla, { width: lado, height: lado }, estilo]}>{children}</Animated.View>;
}

/** La vidriera: un pan, una medialuna y un alfajor que pasan por una cinta. Es lo que se ve mientras algo carga */
function CargandoComponent({ tamano = 'normal', mensaje, color, llenarAlto = false, style }: CargandoProps) {
  const theme = useTheme();
  const estilos = useStyles(createStyles);
  const calma = useReducedMotion();
  const avance = useSharedValue(0);
  // Para el degradado de la cinta: en la web los ids son de toda la página, y cada loader tiene su color
  const degradado = `cinta${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const chico = tamano === 'chico';
  const ancho = chico ? theme.sizes.vidrieraChico : theme.sizes.vidriera;
  const escala = ancho / VENTANA;
  const trazos = TRAZOS[tamano];

  useEffect(() => {
    avance.value = 0;
    avance.value = withRepeat(
      withTiming(1, { duration: calma ? VUELTA_CALMA_MS : VUELTA_MS, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
    return () => cancelAnimation(avance);
  }, [avance, calma]);

  const pintura: Pintura = color
    ? {
        miga: theme.colors[color],
        corte: theme.colors[color],
        galleta: theme.colors[color],
        brillo: null,
        relleno: theme.opacity.relleno,
        contorno: true,
      }
    : {
        miga: theme.colors.pan,
        corte: theme.colors.panCorte,
        galleta: theme.colors.panGalleta,
        brillo: chico ? null : theme.colors.panBrillo,
        contorno: false,
      };
  const colorCinta = color ? theme.colors[color] : theme.colors.border;
  const lado = CASILLA * escala;

  return (
    <View accessible role="progressbar" aria-label={mensaje ?? 'Cargando'} style={[chico ? estilos.enLinea : estilos.apilado, llenarAlto && estilos.llenar, style]}>
      <View style={{ width: ancho, height: lado }} aria-hidden>
        {/* La cinta, quieta, con las puntas que se desvanecen */}
        <Svg width={ancho} height={lado} viewBox={`0 0 ${VENTANA} ${CASILLA}`} style={StyleSheet.absoluteFill}>
          <Defs>
            {/* En unidades de la ventana: sobre una línea recta, un degradado relativo a su caja (que no tiene alto) no se dibuja */}
            <LinearGradient id={degradado} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={VENTANA} y2={0}>
              <Stop offset="0" stopColor={colorCinta} stopOpacity={0} />
              <Stop offset="0.22" stopColor={colorCinta} stopOpacity={color ? 0.5 : 1} />
              <Stop offset="0.78" stopColor={colorCinta} stopOpacity={color ? 0.5 : 1} />
              <Stop offset="1" stopColor={colorCinta} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Line x1={0} y1={44} x2={VENTANA} y2={44} stroke={`url(#${degradado})`} strokeWidth={trazos.cinta} />
        </Svg>
        {CASILLAS.map((orden) => (
          <Casilla key={orden} orden={orden} avance={avance} escala={escala}>
            <Svg width={lado} height={lado} viewBox={`0 0 ${CASILLA} ${CASILLA}`}>
              {/* Las marcas de la cinta pasan con los productos (en el normal: en el chico no se ven) */}
              {!chico && !color && (
                <Line x1={0} y1={47.5} x2={CASILLA} y2={47.5} stroke={theme.colors.border} strokeWidth={1.5} strokeDasharray="2 8" />
              )}
              <Producto cual={orden % 3} pintura={pintura} trazos={trazos} />
            </Svg>
          </Casilla>
        ))}
      </View>
      {chico && mensaje && (
        <Text variant="label" color={color ?? 'textMuted'}>
          {mensaje}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Todas arrancan en el mismo lugar: la posición la pone la animación
  casilla: { position: 'absolute', left: 0, top: 0 },
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    apilado: { alignItems: 'center' },
    llenar: { flexGrow: 1, justifyContent: 'center' },
    enLinea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
  });

export const Cargando = memo(CargandoComponent);
