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
  /** «Con 48 hs de anticipación»; null si se pide en el momento */
  anticipacion: string | null;
  alCambiar: (cantidad: number) => void;
}

/**
 * Un producto del pedido: la foto; el nombre con el subtotal a la derecha; el precio de hoy y con cuánta
 * anticipación se encarga; y la cantidad
 */
export function ItemPedido({ item, cantidad, max, anticipacion, alCambiar }: ItemPedidoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const nombre = nombreParaMostrar(item.nombre);

  return (
    <View style={styles.item}>
      <Miniatura uri={item.portada} lado={theme.sizes.miniatura} />
      <View style={styles.textos}>
        <View style={styles.cabecera}>
          <Text variant="bodyStrong" numberOfLines={2} style={styles.nombre}>
            {nombre}
          </Text>
          <Text variant="bodyStrong" style={styles.subtotal}>
            {formatearPrecio(item.precio * cantidad)}
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          {[`${formatearPrecio(item.precio)} c/u`, anticipacion].filter(Boolean).join(' · ')}
        </Text>
        <View style={styles.cantidad}>
          <ControlCantidad valor={cantidad} alCambiar={alCambiar} max={max} nombre={nombre} />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    item: { flexDirection: 'row', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    textos: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    // El nombre a la izquierda y lo que suma a la derecha: los subtotales quedan en una columna
    cabecera: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
    nombre: { flex: 1 },
    subtotal: { fontVariant: ['tabular-nums'] },
    cantidad: { alignItems: 'flex-start', paddingTop: theme.spacing.xs },
  });
