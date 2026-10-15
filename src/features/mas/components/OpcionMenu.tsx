import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

export interface OpcionMenuProps {
  icono: LucideIcon;
  /** Texto principal. También es lo que lee el lector de pantalla */
  titulo: string;
  /** Una línea que dice qué hay adentro, sin punto final. Toda fila que navega la lleva */
  descripcion?: string;
  onPress: () => void;
  /** `peligro` para lo destructivo (cerrar sesión): ícono y texto en rojo */
  tono?: 'normal' | 'peligro';
  /** Muestra la flecha: abre otra pantalla. `false` para una acción en el lugar */
  navega?: boolean;
}

/** Una fila del menú de Más: ícono, título con lo que hay adentro y la flecha si lleva a otra pantalla */
export function OpcionMenu({ icono, titulo, descripcion, onPress, tono = 'normal', navega = true }: OpcionMenuProps) {
  const styles = useStyles(createStyles);
  const color = tono === 'peligro' ? 'danger' : 'text';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={descripcion}
      style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
    >
      <Icon icon={icono} size="sm" color={color} />
      <View style={styles.textos}>
        <Text color={color} style={styles.titulo}>
          {titulo}
        </Text>
        {descripcion ? (
          <Text variant="caption" color="textMuted">
            {descripcion}
          </Text>
        ) : null}
      </View>
      {navega && <Icon icon={ChevronRight} color="textMuted" />}
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: theme.sizes.touchMin,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    presionada: { opacity: theme.opacity.pressed },
    textos: { flex: 1, gap: theme.spacing.xxs },
    titulo: { fontFamily: theme.fonts.textoMedio },
  });
