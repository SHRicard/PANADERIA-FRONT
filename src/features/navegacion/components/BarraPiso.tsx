import { StyleSheet, View } from 'react-native';
import { useStyles, type Theme } from '@/theme';
import type { BarraProps } from '../pestanas';
import { PestanaRellena } from './PestanaRellena';

// Pegada al piso, de lado a lado, con la línea fina arriba. La activa se marca rellenando el ícono
export function BarraPiso({ pestanas, margenInferior }: BarraProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.envoltorio, { paddingBottom: margenInferior }]}>
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
    envoltorio: { backgroundColor: theme.colors.surface },
    barra: {
      flexDirection: 'row',
      height: theme.sizes.control + theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
  });
