import { Pressable, StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Button, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { cantidadDeProductos } from '../textos';
import type { Tipo } from '../types';

interface TarjetaTipoProps {
  tipo: Tipo;
  /** Abre el renombre */
  onAbrir: () => void;
  onBorrar: () => void;
}

/**
 * Un tipo en la lista: el nombre y cuántos productos lo usan. Tocarlo abre el renombre; «Borrar», aparte (un botón
 * no va adentro de otro), pide confirmación
 */
export function TarjetaTipo({ tipo, onAbrir, onBorrar }: TarjetaTipoProps) {
  const styles = useStyles(createStyles);
  const productos = cantidadDeProductos(tipo.cantidadProductos);

  return (
    <View style={styles.tarjeta}>
      <Pressable
        onPress={onAbrir}
        accessibilityRole="button"
        accessibilityLabel={`${tipo.nombre}, ${productos}`}
        accessibilityHint="Cambiarle el nombre"
        style={({ pressed }) => [styles.datos, pressed && styles.presionada]}
      >
        <Text variant="bodyStrong" numberOfLines={2}>
          {tipo.nombre}
        </Text>
        <Text variant="caption" color="textMuted">
          {productos}
        </Text>
      </Pressable>
      <Button
        variant="danger"
        size="sm"
        icon={Trash2}
        label="Borrar"
        onPress={onBorrar}
        accessibilityLabel={`Borrar el tipo ${tipo.nombre}`}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    datos: { flex: 1, gap: theme.spacing.xxs },
    presionada: { opacity: theme.opacity.pressed },
  });
