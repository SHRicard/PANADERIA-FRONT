import { StyleSheet, View } from 'react-native';
import { ControlCantidad, Miniatura, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { ItemCotizado } from '../types';

interface ItemPedidoProps {
  item: ItemCotizado;
  /** La del carrito, que puede ir un paso adelante de la cotización mientras se toca «+» */
  cantidad: number;
  max: number;
  alCambiar: (cantidad: number) => void;
}

/** Un producto del pedido: la foto, el nombre, el precio de hoy, la cantidad y el subtotal */
export function ItemPedido({ item, cantidad, max, alCambiar }: ItemPedidoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const nombre = nombreParaMostrar(item.nombre);

  return (
    <View style={styles.item}>
      <Miniatura uri={item.portada} lado={theme.sizes.miniatura} />
      <View style={styles.textos}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {nombre}
        </Text>
        <Text variant="caption" color="textMuted">
          {formatearPrecio(item.precio)} c/u
        </Text>
        <View style={styles.fila}>
          <ControlCantidad valor={cantidad} alCambiar={alCambiar} max={max} nombre={nombre} />
          <Text variant="bodyStrong" style={styles.subtotal}>
            {formatearPrecio(item.precio * cantidad)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    item: { flexDirection: 'row', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    textos: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md, paddingTop: theme.spacing.xs },
    subtotal: { fontVariant: ['tabular-nums'] },
  });
