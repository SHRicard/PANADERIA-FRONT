import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';

// Píldora flotante donde solo la pestaña activa muestra el nombre, estirada y con el color de la marca
export function BarraExpandida({ pestanas, margenInferior }: BarraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.contenedor, { paddingBottom: margenInferior + theme.spacing.sm }]}>
      <View style={styles.barra} accessibilityRole="tablist">
        {pestanas.map(({ clave, titulo, icono, activa, alPresionar }) => (
          <Pressable
            key={clave}
            onPress={alPresionar}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            accessibilityLabel={titulo}
            style={({ pressed }) => [styles.pestana, activa && styles.activa, pressed && styles.presionada]}
          >
            <Icon icon={icono} size="lg" color={activa ? 'onPrimary' : 'textMuted'} />
            {activa && (
              <Text variant="label" color="onPrimary" numberOfLines={1}>
                {titulo}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenedor: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    barra: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    pestana: {
      flex: 1,
      height: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },
    activa: { flex: 2.4, paddingHorizontal: theme.spacing.md, backgroundColor: theme.colors.primary },
    presionada: { opacity: theme.opacity.pressed },
  });
