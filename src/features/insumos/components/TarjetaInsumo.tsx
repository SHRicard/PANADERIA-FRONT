import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { fechaLarga } from '../fechas';
import type { Insumo } from '../types';

interface TarjetaInsumoProps {
  insumo: Insumo;
  onPress: () => void;
}

/** Un insumo en la lista: el nombre, lo que pagó la última vez y cuándo */
export function TarjetaInsumo({ insumo, onPress }: TarjetaInsumoProps) {
  const styles = useStyles(createStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${insumo.nombre}, ${formatearPrecio(insumo.precio)}`}
      accessibilityHint="Ver el historial"
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <View style={styles.datos}>
        <View style={styles.fila}>
          <Text variant="subtitle" numberOfLines={2} style={styles.nombre}>
            {insumo.nombre}
          </Text>
          <Text variant="subtitle" style={styles.cifra}>
            {formatearPrecio(insumo.precio)}
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          Última compra: {fechaLarga(insumo.fecha)}
        </Text>
      </View>
      <View style={styles.flecha}>
        <Icon icon={ChevronRight} color="textMuted" />
      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    presionada: { opacity: theme.opacity.pressed },
    datos: { flex: 1, gap: theme.spacing.xs },
    fila: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.sm },
    nombre: { flex: 1 },
    cifra: { fontVariant: ['tabular-nums'] },
    flecha: { justifyContent: 'center' },
  });
