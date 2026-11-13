import { StyleSheet, View } from 'react-native';
import { ControlCantidad, Miniatura, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';

interface ItemPedidoProps {
  /**
   * Lo que se muestra del producto. Sin cotización (falló), llega sin precio ni foto: se ve el nombre y la cantidad,
   * para que el cliente no pierda de vista lo que eligió
   */
  item: { nombre: string; precio: number | null; portada: string | null };
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
          {item.precio !== null && (
            <Text variant="bodyStrong" style={styles.subtotal}>
              {formatearPrecio(item.precio * cantidad)}
            </Text>
          )}
        </View>
        {(item.precio !== null || anticipacion) && (
          <Text variant="caption" color="textMuted">
            {[item.precio !== null && `${formatearPrecio(item.precio)} c/u`, anticipacion].filter(Boolean).join(' · ')}
          </Text>
        )}
        <View style={styles.cantidad}>
          <ControlCantidad valor={cantidad} alCambiar={alCambiar} max={max} nombre={nombre} />
        </View>
        {/* El «+» se apaga en el tope: que se entienda por qué */}
        {cantidad >= max && (
          <Text variant="caption" color="textMuted">
            {`Podés pedir hasta ${max} de cada producto.`}
          </Text>
        )}
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
