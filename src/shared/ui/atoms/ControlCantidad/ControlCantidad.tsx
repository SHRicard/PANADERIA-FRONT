import { Pressable, StyleSheet, View } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface ControlCantidadProps {
  /** Cuántos hay. Con 0 se ve solo el botón de agregar */
  valor: number;
  alCambiar: (valor: number) => void;
  /** Tope de unidades */
  max?: number;
  /** Qué se cuenta, para el lector de pantalla: "Tarta de frutilla" */
  nombre: string;
}

/**
 * Agregar y cambiar la cantidad de algo. Con 0, un botón redondo con «+»; con 1 o más, «− 2 +».
 * Con 1, el «−» es un tachito: quita del todo
 */
export function ControlCantidad({ valor, alCambiar, max = Number.POSITIVE_INFINITY, nombre }: ControlCantidadProps) {
  const styles = useStyles(createStyles);

  if (valor === 0) {
    return (
      <Pressable
        onPress={() => alCambiar(1)}
        accessibilityRole="button"
        accessibilityLabel={`Agregar ${nombre}`}
        hitSlop={styles.alcance.padding}
        style={({ pressed }) => [styles.boton, styles.agregar, pressed && styles.presionado]}
      >
        <Icon icon={Plus} color="onPrimary" trazo="grueso" />
      </Pressable>
    );
  }

  return (
    <View style={styles.control} accessibilityLabel={`${nombre}: ${valor}`}>
      <Pressable
        onPress={() => alCambiar(valor - 1)}
        accessibilityRole="button"
        accessibilityLabel={valor === 1 ? `Quitar ${nombre}` : `Uno menos de ${nombre}`}
        hitSlop={styles.alcance.padding}
        style={({ pressed }) => [styles.boton, styles.restar, pressed && styles.presionado]}
      >
        <Icon icon={valor === 1 ? Trash2 : Minus} size="sm" color={valor === 1 ? 'danger' : 'text'} />
      </Pressable>
      <Text variant="bodyStrong" style={styles.valor}>
        {valor}
      </Text>
      <Pressable
        onPress={() => alCambiar(valor + 1)}
        disabled={valor >= max}
        accessibilityRole="button"
        accessibilityLabel={`Uno más de ${nombre}`}
        accessibilityState={{ disabled: valor >= max }}
        hitSlop={styles.alcance.padding}
        style={({ pressed }) => [styles.boton, styles.agregar, valor >= max && styles.deshabilitado, pressed && styles.presionado]}
      >
        <Icon icon={Plus} size="sm" color="onPrimary" trazo="grueso" />
      </Pressable>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    control: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    // Los botones son chicos para no tapar la fila: el toque llega igual a 44 con el alcance
    boton: {
      width: theme.sizes.iconoPestanaChico,
      height: theme.sizes.iconoPestanaChico,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
    },
    alcance: { padding: (theme.sizes.touchMin - theme.sizes.iconoPestanaChico) / 2 },
    agregar: { backgroundColor: theme.colors.primary },
    restar: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
    presionado: { opacity: theme.opacity.pressed },
    deshabilitado: { opacity: theme.opacity.disabled },
    valor: { minWidth: theme.spacing.lg, textAlign: 'center', fontVariant: ['tabular-nums'] },
  });
