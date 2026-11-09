import { StyleSheet, View } from 'react-native';
import { Badge, ControlCantidad, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import type { LineaEditada } from '../hooks/useEditarProductosPedido';

interface FilaLineaPedidoProps {
  linea: LineaEditada;
  max: number;
  alCambiar: (cantidad: number) => void;
}

/**
 * Un producto del pedido en «Editar productos»: el nombre, el precio (el del pedido si ya estaba, el de hoy si es
 * nuevo) y la cantidad. Uno que ya estaba y se puso en 0 queda tachado, con el «+» para volver a sumarlo
 */
export function FilaLineaPedido({ linea, max, alCambiar }: FilaLineaPedidoProps) {
  const styles = useStyles(createStyles);
  const nombre = nombreParaMostrar(linea.nombre);
  const sacado = linea.cantidad === 0;

  return (
    <View style={styles.fila}>
      <View style={styles.textos}>
        <Text variant="bodyStrong" numberOfLines={2} color={sacado ? 'textMuted' : 'text'} style={sacado && styles.tachado}>
          {nombre}
        </Text>
        <Text variant="caption" color="textMuted" style={styles.cifra}>
          {sacado
            ? 'Se saca del pedido'
            : `${formatearPrecio(linea.precio)} c/u · ${formatearPrecio(linea.precio * linea.cantidad)}`}
        </Text>
        {/* Lo nuevo entra con el precio de hoy; lo que ya estaba conserva el del pedido */}
        {!linea.original && <Badge tone="primary" label="Agregado" />}
      </View>
      <ControlCantidad valor={linea.cantidad} alCambiar={alCambiar} max={max} nombre={nombre} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.sm },
    textos: { flex: 1, gap: theme.spacing.xxs, alignItems: 'flex-start' },
    tachado: { textDecorationLine: 'line-through' },
    cifra: { fontVariant: ['tabular-nums'] },
  });
