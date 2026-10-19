import { StyleSheet, View } from 'react-native';
import { useStyles, type Theme } from '@/theme';

interface MiniPreciosProps {
  /** De la compra más vieja a la más nueva: el precio, o el del kilo, litro o unidad */
  precios: number[];
}

/** Cómo fue cambiando el precio de un insumo (el total o el del kilo), compra por compra: barras chicas desde el cero, la última más marcada */
export function MiniPrecios({ precios }: MiniPreciosProps) {
  const styles = useStyles(createStyles);
  const tope = Math.max(1, ...precios);

  return (
    <View style={styles.grafico} importantForAccessibility="no-hide-descendants">
      {precios.map((precio, indice) => (
        <View
          key={indice}
          style={[styles.barra, indice < precios.length - 1 && styles.anterior, { height: `${(precio / tope) * 100}%` }]}
        />
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grafico: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.xxs, height: theme.sizes.graficoMini },
    barra: {
      width: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
    anterior: { opacity: theme.opacity.disabled },
  });
