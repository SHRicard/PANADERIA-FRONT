import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { useBreakpoint } from '@/shared/hooks';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { azar } from './azar';

/** Un dibujo del patrón y cuánto se tuerce */
export interface DibujoPatron {
  nombre: NombreAssetNavidad;
  giro: number;
}

interface PatronNavidadProps {
  /**
   * Los dibujos, en el orden en que se repiten: seis. Van en diagonal: el de la columna `c` y la fila `f` es el
   * `(c + 2f) % 6`, así ninguno queda al lado de uno igual
   */
  dibujos: readonly DibujoPatron[];
  /** Entre los dibujos: el puntito dorado del papel de regalo, o una estrellita que titila */
  entre?: 'punto' | 'estrella';
  /** Hacia dónde se corre, muy despacio: en diagonal, o para abajo, como la nieve */
  deriva?: 'diagonal' | 'cae';
}

const ESTRELLA = '✦';
// Cuánto tarda la deriva en correrse un período: en diagonal, el período entero; para abajo, cada fila
const DIAGONAL_S = 60;
const FILA_S = 12;

/**
 * El período del patrón (en pasos): cada cuánto vuelve a ser el mismo. En diagonal, dos columnas y dos filas; para abajo,
 * las filas que hacen falta para que el corrimiento de cada fila dé la vuelta entera (y que sean pares, por el ladrillo).
 * La deriva corre justo un período: da la vuelta sin que se note
 */
function periodo(cantidad: number, deriva: 'diagonal' | 'cae') {
  const corrimiento = cantidad / 2 - 1;
  if (deriva === 'diagonal') return { columnas: 2, filas: 2, corrimiento };
  let filas = 2;
  while ((corrimiento * filas) % cantidad !== 0) filas += 2;
  return { columnas: 0, filas, corrimiento };
}

/**
 * Un patrón de dibujos de Navidad, como un papel de regalo: los dibujos en ladrillo (cada fila corrida medio paso),
 * apenas torcidos y suaves, con un puntito dorado o una estrellita entre ellos. Va fijo detrás de la página (`fondo` de
 * ScreenContainer): el catálogo se desliza por encima. Solo llena la ventana, así son pocos dibujos aunque el catálogo
 * sea largo, y deriva despacio. Quieto con «reducir movimiento» (las estrellas, prendidas)
 */
export function PatronNavidad({ dibujos, entre = 'punto', deriva = 'diagonal' }: PatronNavidadProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const enCompu = useBreakpoint() === 'compu';
  const [medida, setMedida] = useState({ ancho: 0, alto: 0 });
  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width !== medida.ancho || layout.height !== medida.alto) setMedida({ ancho: layout.width, alto: layout.height });
  };

  const paso = enCompu ? theme.sizes.patronPasoCompu : theme.sizes.patronPaso;
  const lado = enCompu ? theme.sizes.patronDibujoCompu : theme.sizes.patronDibujo;
  const vuelta = periodo(dibujos.length, deriva);
  const corridoX = vuelta.columnas * paso;
  const corridoY = vuelta.filas * paso;
  // Lo que entra mientras deriva, más un paso de cada lado: los dibujos del borde quedan cortados por la mitad
  const columnas = Math.ceil(medida.ancho / paso) + vuelta.columnas + 2;
  const filas = Math.ceil(medida.alto / paso) + vuelta.filas + 2;
  const opacidad = theme.mode === 'dark' ? theme.opacity.patronNoche : theme.opacity.patron;
  const movimiento: CSSAnimationKeyframes = {
    from: { transform: [{ translateX: 0 }, { translateY: 0 }] },
    to: { transform: [{ translateX: corridoX }, { translateY: corridoY }] },
  };
  const titilar: CSSAnimationKeyframes = {
    '0%': { opacity: theme.opacity.estrellaPatron * 0.2, transform: [{ scale: 0.6 }] },
    '50%': { opacity: theme.opacity.estrellaPatron, transform: [{ scale: 1.1 }] },
    '100%': { opacity: theme.opacity.estrellaPatron * 0.2, transform: [{ scale: 0.6 }] },
  };

  return (
    <View onLayout={medir} style={styles.marco} aria-hidden>
      {medida.ancho > 0 && (
        <Animated.View
          style={[
            styles.capa,
            { left: -corridoX - paso, top: -corridoY - paso, width: columnas * paso, height: filas * paso },
            !calma && {
              animationName: movimiento,
              animationDuration: `${deriva === 'diagonal' ? DIAGONAL_S : vuelta.filas * FILA_S}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            },
          ]}
        >
          {Array.from({ length: filas }, (_, f) =>
            Array.from({ length: columnas }, (_, c) => {
              const { nombre, giro } = dibujos[(c + vuelta.corrimiento * f) % dibujos.length];
              // Las filas impares, corridas medio paso: el ladrillo
              const x = c * paso + (f % 2 === 1 ? paso / 2 : 0);
              const y = f * paso;
              const n = f * columnas + c;
              const estrella = azar(n, 7) > 0.7 ? theme.sizes.destelloGrande : theme.sizes.destello;
              const segundos = 2.2 + azar(n, 8) * 2.6;
              return (
                <View key={`${f}-${c}`}>
                  <Ilustracion
                    nombre={nombre}
                    alto={lado}
                    style={[styles.dibujo, { left: x - lado / 2, top: y - lado / 2, opacity: opacidad, transform: [{ rotate: `${giro}deg` }] }]}
                  />
                  {entre === 'punto' ? (
                    <View style={[styles.punto, { left: x + paso / 2, top: y + paso / 2, opacity: opacidad }]} />
                  ) : (
                    <Animated.Text
                      style={[
                        styles.estrella,
                        {
                          left: x + paso / 2 - estrella / 2,
                          top: y + paso / 2 - estrella / 2,
                          width: estrella,
                          fontSize: estrella,
                          lineHeight: estrella,
                        },
                        calma
                          ? { opacity: theme.opacity.estrellaPatron * 0.7 }
                          : {
                              animationName: titilar,
                              animationDuration: `${segundos}s`,
                              animationDelay: `${-azar(n, 9) * segundos}s`,
                              animationIterationCount: 'infinite',
                              animationTimingFunction: 'ease-in-out',
                            },
                      ]}
                    >
                      {ESTRELLA}
                    </Animated.Text>
                  )}
                </View>
              );
            }),
          )}
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { ...StyleSheet.absoluteFill, overflow: 'hidden', pointerEvents: 'none' },
    capa: { position: 'absolute' },
    dibujo: { position: 'absolute' },
    punto: {
      position: 'absolute',
      width: theme.sizes.copoMedio,
      height: theme.sizes.copoMedio,
      marginLeft: -theme.sizes.copoMedio / 2,
      marginTop: -theme.sizes.copoMedio / 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent,
    },
    estrella: { position: 'absolute', textAlign: 'center', color: theme.colors.accent },
  });
