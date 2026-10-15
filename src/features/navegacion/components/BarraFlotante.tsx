import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';

// Píldora flotante con los cuatro nombres (estilo iPhone). La pestaña activa lleva una "lente" detrás
export function BarraFlotante({ pestanas, margenInferior }: BarraProps) {
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
            <Icon icon={icono} size="lg" color={activa ? 'primary' : 'textMuted'} />
            <Text variant="caption" color={activa ? 'primary' : 'textMuted'} style={activa && styles.etiquetaActiva}>
              {titulo}
            </Text>
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
      padding: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    pestana: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xxs,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
    },
    activa: { backgroundColor: theme.colors.surfaceMuted },
    presionada: { opacity: theme.opacity.pressed },
    etiquetaActiva: { fontFamily: theme.fonts.textoNegrita },
  });
