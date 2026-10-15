import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyles, type Theme } from '@/theme';

interface GrillaProps {
  columnas: number;
  children: ReactNode;
}

/** Reparte los hijos en filas de `columnas`. La última fila se completa con huecos para no estirar */
export function Grilla({ columnas, children }: GrillaProps) {
  const styles = useStyles(createStyles);
  const items = Children.toArray(children);
  const filas: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columnas) filas.push(items.slice(i, i + columnas));

  return (
    <View style={styles.grilla}>
      {filas.map((fila, i) => (
        <View key={i} style={styles.fila}>
          {Array.from({ length: columnas }, (_, j) => (
            <View key={j} style={styles.celda}>
              {fila[j]}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grilla: { gap: theme.spacing.md },
    fila: { flexDirection: 'row', gap: theme.spacing.md },
    celda: { flex: 1, minWidth: 0 },
  });
