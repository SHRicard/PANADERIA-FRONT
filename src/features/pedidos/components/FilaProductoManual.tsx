import { StyleSheet, View } from 'react-native';
import type { Producto } from '@/features/productos';
import { Badge, ControlCantidad, Miniatura, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';

interface FilaProductoManualProps {
  producto: Producto;
  cantidad: number;
  max: number;
  alCambiar: (cantidad: number) => void;
}

/** Un producto para elegir en el pedido manual: la foto, el nombre, el precio y la cantidad */
export function FilaProductoManual({ producto, cantidad, max, alCambiar }: FilaProductoManualProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const nombre = nombreParaMostrar(producto.nombre);

  return (
    <View style={styles.fila}>
      <Miniatura uri={producto.imagenes[0]?.miniatura ?? null} lado={theme.sizes.miniatura} />
      <View style={styles.textos}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {nombre}
        </Text>
        <Text variant="caption" color="textMuted" style={styles.cifra}>
          {cantidad > 0
            ? `${formatearPrecio(producto.precio)} c/u · ${formatearPrecio(producto.precio * cantidad)}`
            : formatearPrecio(producto.precio)}
        </Text>
        {/* Un pausado no se ve en la web, pero el dueño lo puede anotar igual */}
        {!producto.disponible && <Badge tone="neutral" label="Pausado" />}
      </View>
      <ControlCantidad valor={cantidad} alCambiar={alCambiar} max={max} nombre={nombre} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.sm },
    textos: { flex: 1, gap: theme.spacing.xxs, alignItems: 'flex-start' },
    cifra: { fontVariant: ['tabular-nums'] },
  });
