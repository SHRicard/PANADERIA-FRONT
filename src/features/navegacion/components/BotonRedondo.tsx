import { Pressable, StyleSheet } from 'react-native';
import { Icon } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { AccionEncabezado } from '../encabezado';

interface BotonRedondoProps {
  accion: AccionEncabezado;
  /** `lleno`: con el color de la marca. `borde`: solo el contorno, más liviano */
  variante: 'lleno' | 'borde';
}

/** La acción del encabezado cuando no entra el texto: solo el ícono, en un círculo del tamaño mínimo tocable */
export function BotonRedondo({ accion, variante }: BotonRedondoProps) {
  const styles = useStyles(createStyles);

  return (
    <Pressable
      onPress={accion.onPress}
      accessibilityRole="button"
      accessibilityLabel={accion.accessibilityLabel ?? accion.label}
      style={({ pressed }) => [styles.boton, styles[variante], pressed && styles.presionado]}
    >
      <Icon icon={accion.icon} color={variante === 'lleno' ? 'onPrimary' : 'primary'} />
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    boton: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
    },
    lleno: { backgroundColor: theme.colors.primary },
    borde: { borderWidth: 1, borderColor: theme.colors.primary },
    presionado: { opacity: theme.opacity.pressed },
  });
