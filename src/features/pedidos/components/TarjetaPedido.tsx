import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Badge, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { ESTADO, fechaYHora, textoUnidades } from '../textos';
import type { Pedido } from '../types';

interface TarjetaPedidoProps {
  pedido: Pedido;
  onPress: () => void;
}

/** Un pedido en la lista: quién, cuándo, cuánto y en qué estado está */
export function TarjetaPedido({ pedido, onPress }: TarjetaPedidoProps) {
  const styles = useStyles(createStyles);
  const unidades = pedido.items.reduce((suma, item) => suma + item.cantidad, 0);
  const estado = ESTADO[pedido.estado];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Pedido de ${pedido.clienteNombre}, ${formatearPrecio(pedido.total)}, ${estado.label}`}
      accessibilityHint="Ver el detalle"
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <View style={styles.datos}>
        <View style={styles.fila}>
          <Text variant="subtitle" numberOfLines={1} style={styles.nombre}>
            {pedido.clienteNombre}
          </Text>
          <Text variant="subtitle" style={styles.cifra}>
            {formatearPrecio(pedido.total)}
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          {fechaYHora(pedido.createdAt)} · {textoUnidades(unidades)}
        </Text>
        <View style={styles.fila}>
          <Badge tone={estado.tone} label={estado.label} />
          {/* Con seña, lo que falta cobrar al entregar */}
          {pedido.estado === 'confirmado' && (
            <Text variant="caption" color="textMuted" style={styles.cifra}>
              Falta cobrar {formatearPrecio(pedido.saldo)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.flecha}>
        <Icon icon={ChevronRight} color="textMuted" />
      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    presionada: { opacity: theme.opacity.pressed },
    datos: { flex: 1, gap: theme.spacing.xs },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    nombre: { flex: 1 },
    cifra: { fontVariant: ['tabular-nums'] },
    flecha: { justifyContent: 'center' },
  });
