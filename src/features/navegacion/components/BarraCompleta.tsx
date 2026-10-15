import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';

// Barra de ancho completo, pegada abajo (estilo Mercado Libre). El ícono activo va en una píldora. Es la de fábrica
export function BarraCompleta({ pestanas, margenInferior }: BarraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View
      style={[styles.barra, { paddingBottom: margenInferior + theme.spacing.xs }]}
      accessibilityRole="tablist"
    >
      {pestanas.map(({ clave, titulo, icono, activa, alPresionar }) => (
        <Pressable
          key={clave}
          onPress={alPresionar}
          accessibilityRole="tab"
          accessibilityState={{ selected: activa }}
          accessibilityLabel={titulo}
          style={({ pressed }) => [styles.pestana, pressed && styles.presionada]}
        >
          <View style={[styles.indicador, activa && styles.indicadorActivo]}>
            <Icon icon={icono} size="lg" color={activa ? 'primary' : 'textMuted'} />
          </View>
          <Text variant="caption" color={activa ? 'text' : 'textMuted'} style={activa && styles.etiquetaActiva}>
            {titulo}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: {
      flexDirection: 'row',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    pestana: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
    indicador: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },
    indicadorActivo: { backgroundColor: theme.colors.primarySoft },
    presionada: { opacity: theme.opacity.pressed },
    etiquetaActiva: { fontFamily: theme.fonts.textoNegrita },
  });
