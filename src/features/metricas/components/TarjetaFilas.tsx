import { Children, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyles, type Theme } from '@/theme';

/** Una tarjeta con filas una debajo de la otra, separadas por una línea (el ranking, los estados) */
export function TarjetaFilas({ children }: { children: ReactNode }) {
  const styles = useStyles(createStyles);
  const filas = Children.toArray(children);

  return (
    <View style={styles.tarjeta}>
      {filas.map((fila, indice) => (
        <View key={isValidElement(fila) && fila.key !== null ? fila.key : indice} style={indice > 0 && styles.separada}>
          {fila}
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    separada: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  });
