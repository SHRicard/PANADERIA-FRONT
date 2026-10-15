import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Icon } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';
import { PestanaRellena } from './PestanaRellena';

// Transición y no resorte: en un recorrido tan corto, el rebote se lee como un temblor
const ANIMACION = { duration: 220, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System };

/**
 * Pegada al piso; el ícono de la pestaña activa sube a una burbuja montada sobre el borde de arriba,
 * que se desliza al cambiar de pestaña
 */
export function BarraBurbuja({ pestanas, margenInferior }: BarraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [ancho, setAncho] = useState(0);
  const indice = Math.max(0, pestanas.findIndex(({ activa }) => activa));
  const activa = pestanas[indice];

  const x = useSharedValue(0);
  const ubicada = useRef(false);
  const diametro = theme.sizes.control;

  useEffect(() => {
    if (ancho === 0) return;
    const destino = (ancho / pestanas.length) * (indice + 0.5) - diametro / 2;
    // La primera vez, sin animar: si no, la burbuja entra volando desde la izquierda cada vez que se abre la app
    x.value = ubicada.current ? withTiming(destino, ANIMACION) : destino;
    ubicada.current = true;
  }, [ancho, indice, pestanas.length, diametro, x]);

  const deslizamiento = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.envoltorio, { paddingBottom: margenInferior }]}>
      {/* El aire de arriba, para la mitad de la burbuja que queda afuera de la barra. Sin él, Android la recorta */}
      <View style={styles.aire} />
      <View style={styles.barra} accessibilityRole="tablist" onLayout={(e) => setAncho(e.nativeEvent.layout.width)}>
        {pestanas.map((pestana) => (
          <PestanaRellena key={pestana.clave} pestana={pestana} iconoOculto={pestana.activa} />
        ))}
      </View>

      {/* Decoración: la pestaña de abajo ya dice cuál está activa. Los toques pasan de largo */}
      {ancho > 0 && activa && (
        <Animated.View style={[styles.burbuja, deslizamiento]} aria-hidden>
          <Icon icon={activa.icono} size="lg" color="onPrimary" />
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    envoltorio: { backgroundColor: theme.colors.surface },
    aire: { height: theme.sizes.control / 2, backgroundColor: theme.colors.background },
    barra: {
      flexDirection: 'row',
      height: theme.sizes.control + theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    burbuja: {
      position: 'absolute',
      top: theme.spacing.none,
      left: theme.spacing.none,
      width: theme.sizes.control,
      height: theme.sizes.control,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      // El anillo del color del fondo corta la línea de la barra: se lee "montada" y no pegada
      borderWidth: theme.spacing.xs,
      borderColor: theme.colors.background,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
      pointerEvents: 'none',
    },
  });
