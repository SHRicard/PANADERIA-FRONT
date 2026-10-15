import { Pressable, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface OpcionSegmentado<T extends string> {
  valor: T;
  label: string;
  icono?: LucideIcon;
}

export interface SegmentadoProps<T extends string> {
  opciones: readonly OpcionSegmentado<T>[];
  valor: T;
  alCambiar: (valor: T) => void;
  /** Qué se elige, para el lector de pantalla: "Tema", "Barra de pestañas"… */
  accessibilityLabel: string;
}

/** Elegir una opción entre pocas (2 a 4), todas a la vista. Se comporta como un grupo de radios */
export function Segmentado<T extends string>({ opciones, valor, alCambiar, accessibilityLabel }: SegmentadoProps<T>) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.grupo} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor;
        return (
          <Pressable
            key={opcion.valor}
            onPress={() => alCambiar(opcion.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa }}
            accessibilityLabel={opcion.label}
            style={[styles.opcion, activa && styles.activa]}
          >
            {opcion.icono && <Icon icon={opcion.icono} size="sm" color={activa ? 'text' : 'textMuted'} />}
            <Text variant="label" color={activa ? 'text' : 'textMuted'} numberOfLines={1}>
              {opcion.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grupo: {
      flexDirection: 'row',
      gap: theme.spacing.xxs,
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceMuted,
    },
    opcion: {
      flex: 1,
      minHeight: theme.sizes.touchMin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activa: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  });
