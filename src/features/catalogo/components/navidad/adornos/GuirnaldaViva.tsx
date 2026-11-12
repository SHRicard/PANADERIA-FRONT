import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useStyles, useTheme, type Theme } from '@/theme';
import { azar } from './azar';
import { COLORES_FOCO, Foco } from './Foco';

// Cada cuánto va una ramita y cuántas agujas tiene; cada cuánto unos frutos rojos
const PASO_RAMITA = 10;
const AGUJAS = 14;
const PASO_FRUTOS = 72;

interface Punto {
  x: number;
  y: number;
}

/** Puntos repartidos parejo a lo largo de un camino (una línea o el contorno de un rectángulo), cada `paso` */
function repartir(camino: Punto[], paso: number): Punto[] {
  const puntos: Punto[] = [];
  // Cuánto falta para el próximo punto: pasa de un tramo al otro (en las esquinas cortas puede saltearse un tramo)
  let falta = 0;
  for (let t = 0; t < camino.length - 1; t += 1) {
    const a = camino[t];
    const b = camino[t + 1];
    const largo = Math.hypot(b.x - a.x, b.y - a.y);
    let d = falta;
    for (; d < largo; d += paso) puntos.push({ x: a.x + ((b.x - a.x) * d) / largo, y: a.y + ((b.y - a.y) * d) / largo });
    falta = d - largo;
  }
  return puntos;
}

/** El pino a lo largo de un camino: las agujas en dos verdes (un trazo por tono: liviano aunque sean miles) y frutos */
function Pino({ camino, ancho, alto }: { camino: Punto[]; ancho: number; alto: number }) {
  const theme = useTheme();
  const grosor = theme.sizes.guirnalda;
  const tonos = ['', ''];
  repartir(camino, PASO_RAMITA).forEach(({ x, y }, i) => {
    for (let k = 0; k < AGUJAS; k += 1) {
      const n = i * AGUJAS + k;
      const angulo = (Math.PI * 2 * k) / AGUJAS + azar(n, 3) * 0.5;
      const largo = grosor * (0.22 + azar(n, 5) * 0.2);
      tonos[k % 2] += `M${x.toFixed(1)} ${y.toFixed(1)} L${(x + Math.cos(angulo) * largo).toFixed(1)} ${(y + Math.sin(angulo) * largo * 0.8).toFixed(1)} `;
    }
  });
  const frutos = repartir(camino, PASO_FRUTOS).map(({ x, y }, i) => ({ x: x + (azar(i, 9) - 0.5) * 10, y: y + grosor * 0.1 }));

  return (
    <Svg width={ancho} height={alto} style={StyleSheet.absoluteFill}>
      <Path d={tonos[0]} stroke={theme.colors.pinoOscuro} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d={tonos[1]} stroke={theme.colors.pino} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {frutos.map(({ x, y }) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={3.4} fill={theme.colors.cinta} />
      ))}
      {frutos.map(({ x, y }) => (
        <Circle key={`b${x}-${y}`} cx={x + 5} cy={y + 3} r={3} fill={theme.colors.cinta} />
      ))}
    </Svg>
  );
}

/** Los foquitos sobre el pino: cada uno de un color, apenas torcido para cualquier lado */
function Focos({ camino }: { camino: Punto[] }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const mitad = theme.sizes.haloFoquito / 2;

  return repartir(camino, theme.sizes.pasoFoquito).map(({ x, y }, i) => (
    <View key={i} style={[styles.foco, { left: x - mitad, top: y - mitad / 2 + (azar(i, 17) - 0.5) * theme.sizes.guirnalda * 0.3 }]}>
      <Foco color={COLORES_FOCO[i % COLORES_FOCO.length]} indice={i} giro={`${(azar(i, 19) - 0.5) * 70}deg`} />
    </View>
  ));
}

function useMedida() {
  const [medida, setMedida] = useState({ ancho: 0, alto: 0 });
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== medida.ancho || layout.height !== medida.alto) setMedida({ ancho: layout.width, alto: layout.height });
  };
  return { ...medida, medir };
}

/**
 * La guirnalda de pino con luces vivas, recta, del ancho que le den: las agujas y los frutos dibujados en código y los
 * foquitos encima, cada uno parpadeando a su manera, con la onda de luz que la recorre de punta a punta
 */
export function GuirnaldaViva({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { ancho, alto, medir } = useMedida();
  const medio = theme.sizes.guirnalda / 2;
  const camino = [
    { x: -PASO_RAMITA, y: medio },
    { x: ancho + PASO_RAMITA, y: medio },
  ];

  return (
    <View onLayout={medir} style={[styles.recta, style]} aria-hidden>
      {ancho > 0 && (
        <>
          <Pino camino={camino} ancho={ancho} alto={alto} />
          <Focos camino={camino} />
        </>
      )}
    </View>
  );
}

/**
 * Un marco de guirnalda viva alrededor de lo que lleva adentro (la vidriera): el pino recorre el borde y la onda de luz
 * da la vuelta entera. Lo de adentro queda metido medio grosor, así la guirnalda pisa su borde
 */
export function MarcoGuirnalda({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { ancho, alto, medir } = useMedida();
  const m = theme.sizes.guirnalda / 2;
  // El contorno, en el sentido de las agujas del reloj, con las esquinas apenas recortadas
  const r = theme.radius.xl * 0.6;
  const camino = [
    { x: m + r, y: m },
    { x: ancho - m - r, y: m },
    { x: ancho - m, y: m + r },
    { x: ancho - m, y: alto - m - r },
    { x: ancho - m - r, y: alto - m },
    { x: m + r, y: alto - m },
    { x: m, y: alto - m - r },
    { x: m, y: m + r },
    { x: m + r, y: m },
  ];

  return (
    <View onLayout={medir} style={styles.marco}>
      <View style={styles.adentro}>{children}</View>
      {ancho > 0 && (
        <View style={styles.encima} aria-hidden>
          <Pino camino={camino} ancho={ancho} alto={alto} />
          <Focos camino={camino} />
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    recta: { height: theme.sizes.guirnalda, pointerEvents: 'none' },
    foco: { position: 'absolute' },
    marco: { position: 'relative' },
    adentro: { margin: theme.sizes.guirnalda / 2 },
    encima: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
  });
