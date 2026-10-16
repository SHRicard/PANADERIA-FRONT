import { StyleSheet, View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { Adorno, Button, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import type { PedidoCreado } from '../types';

interface PedidoConfirmadoProps {
  pedido: PedidoCreado;
  alVolver: () => void;
}

/** Después de confirmar: el pedido como quedó en el back (con los precios que cobró) */
export function PedidoConfirmado({ pedido, alVolver }: PedidoConfirmadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.confirmado}>
      <View style={styles.cabecera}>
        <Icon icon={CircleCheck} size="xl" color="success" />
        <Text variant="display" align="center" accessibilityRole="header">
          ¡Recibimos tu pedido!
        </Text>
        <Text color="textMuted" align="center">
          Te vamos a contactar al teléfono que dejaste para coordinar la entrega.
        </Text>
      </View>
      <Adorno forma="izquierda" />
      <View style={styles.lista}>
        {pedido.items.map((item) => (
          <View key={item.producto} style={styles.fila}>
            <Text style={styles.nombre}>
              {item.cantidad} × {nombreParaMostrar(item.nombre)}
            </Text>
            <Text style={styles.cifra}>{formatearPrecio(item.precio * item.cantidad)}</Text>
          </View>
        ))}
        <View style={[styles.fila, styles.total]}>
          <Text variant="subtitle">Total</Text>
          <Text variant="subtitle" style={styles.cifra}>
            {formatearPrecio(pedido.total)}
          </Text>
        </View>
      </View>
      <Button label="Volver al catálogo" onPress={alVolver} fullWidth />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    confirmado: { gap: theme.spacing.lg },
    cabecera: { alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.xl },
    lista: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
    nombre: { flex: 1 },
    total: { paddingTop: theme.spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    cifra: { fontVariant: ['tabular-nums'] },
  });
