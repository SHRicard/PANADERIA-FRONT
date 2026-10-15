import { StyleSheet, View } from 'react-native';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';
import { PestanaRellena } from './PestanaRellena';

// Una cápsula despegada del piso, con sombra. La activa se marca rellenando el ícono
export function BarraCapsula({ pestanas, margenInferior }: BarraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.envoltorio, { paddingBottom: margenInferior + theme.spacing.sm }]}>
      <View style={styles.barra} accessibilityRole="tablist">
        {pestanas.map((pestana) => (
          <PestanaRellena key={pestana.clave} pestana={pestana} />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    envoltorio: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xs,
    },
    barra: {
      flexDirection: 'row',
      height: theme.sizes.control + theme.spacing.lg,
      borderRadius: theme.radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      // boxShadow y no elevation: en Android la de elevation sale rectangular y asoman las esquinas de la cápsula
      boxShadow: `0 ${theme.spacing.xs}px ${theme.spacing.md}px ${theme.colors.shadow}`,
    },
  });
