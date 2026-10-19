import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyles, type Theme } from '@/theme';

/** La caja de un gráfico o de una barra partida */
export function Tarjeta({ children }: { children: ReactNode }) {
  const styles = useStyles(createStyles);
  return <View style={styles.tarjeta}>{children}</View>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
  });
