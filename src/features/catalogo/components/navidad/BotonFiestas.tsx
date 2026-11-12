import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';
import { Cargando } from '@/shared/ui/atoms';
import { fondoDegradado, useStyles, useTheme, type Theme } from '@/theme';
import { Vivo } from './adornos';
import { Ilustracion } from './Ilustracion';

interface BotonFiestasProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** De todo el ancho (confirmar el pedido) o del ancho del texto (agregar al pedido, en el detalle) */
  ancho?: 'completo' | 'justo';
}

// El brillo cruza de punta a punta en un ratito y descansa el resto
const CRUZA_S = 4.5;
const CRUZA: CSSAnimationKeyframes = {
  '0%': { transform: [{ translateX: '-160%' }, { skewX: '-20deg' }] },
  '35%': { transform: [{ translateX: '360%' }, { skewX: '-20deg' }] },
  '100%': { transform: [{ translateX: '360%' }, { skewX: '-20deg' }] },
};

/**
 * El botón principal mientras la web está de Navidad («Confirmar pedido», «Agregar al pedido»): dorado (no rojo), redondeado y del alto de un control, con un
 * resplandor dorado alrededor, el regalo dorado con acebo chico a la izquierda (apenas respira: el dueño no lo quiere
 * saltando) y un brillo que lo cruza cada tanto. Como el `Button`: con la carga mientras confirma y apagado si no se
 * puede tocar. Con «reducir movimiento», sin brillo ni movimiento
 */
export function BotonFiestas({ label, onPress, loading = false, disabled = false, ancho = 'completo' }: BotonFiestasProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const calma = useReducedMotion();
  const bloqueado = disabled || loading;
  const regalo = <Ilustracion nombre="regaloDoradoAcebo" alto={theme.sizes.regaloBoton} />;

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: bloqueado, busy: loading }}
      style={({ pressed }) => [styles.boton, ancho === 'justo' && styles.justo, pressed && !bloqueado && styles.presionado, disabled && styles.apagado]}
    >
      {!calma && !bloqueado && (
        <Animated.View
          aria-hidden
          style={[
            styles.brillo,
            {
              animationName: CRUZA,
              animationDuration: `${CRUZA_S}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            },
          ]}
        />
      )}
      {loading ? (
        <Cargando tamano="chico" color="onAccent" />
      ) : (
        <View aria-hidden>{calma ? regalo : <Vivo como="latir">{regalo}</Vivo>}</View>
      )}
      <Text style={styles.texto}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    boton: {
      position: 'relative',
      overflow: 'hidden',
      alignSelf: 'stretch',
      minHeight: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: colors.onAccent,
      backgroundColor: colors.accent,
      // Dorado con una luz arriba, y el resplandor dorado alrededor
      ...fondoDegradado(`radial-gradient(ellipse at 50% 0%, ${colors.nieve} 0%, transparent 70%), linear-gradient(${colors.accent}, ${colors.accent})`),
      boxShadow: `0 0 ${theme.spacing.lg}px ${colors.resplandor}, 0 ${theme.spacing.xs}px ${theme.spacing.md}px ${colors.shadow}`,
    },
    justo: { alignSelf: 'flex-start' },
    presionado: { transform: [{ scale: 0.98 }], opacity: theme.opacity.pressed },
    apagado: { opacity: theme.opacity.disabled },
    texto: { ...theme.text.bodyStrong, color: colors.onAccent },
    // La franja de luz que cruza
    brillo: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '30%',
      opacity: theme.opacity.brilloBoton,
      pointerEvents: 'none',
      ...fondoDegradado(`linear-gradient(90deg, transparent 0%, ${colors.nieve} 50%, transparent 100%)`),
    },
  });
};
