import { StyleSheet, View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { Adorno, Button, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import type { Cobro, Entrega } from '../sena';
import type { PedidoCreado } from '../types';
import { PagoSena } from './PagoSena';
import { ResumenPedido } from './ResumenPedido';

interface PedidoConfirmadoProps {
  pedido: PedidoCreado;
  /** La seña y el resto: con la seña empiezan a prepararlo */
  cobro: Cobro | null;
  entrega: Entrega | null;
  alVolver: () => void;
}

/** Después de confirmar: el pedido como quedó en el back (con los precios que cobró), la seña y cuándo está listo */
export function PedidoConfirmado({ pedido, cobro, entrega, alVolver }: PedidoConfirmadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.confirmado}>
      <View style={styles.cabecera}>
        <Icon icon={CircleCheck} size="xl" color="success" />
        <Text variant="display" align="center" accessibilityRole="header">
          ¡Recibimos tu pedido!
        </Text>
        <Text color="textMuted" align="center">
          Te vamos a contactar al teléfono que dejaste para coordinar la seña y la entrega.
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
        <View style={styles.cuentas}>
          <ResumenPedido
            unidades={pedido.items.reduce((suma, { cantidad }) => suma + cantidad, 0)}
            total={pedido.total}
            cobro={cobro}
            entrega={entrega}
          />
        </View>
      </View>
      {/* Cómo pagar la seña: transferencia o, en efectivo, por WhatsApp */}
      {cobro && <PagoSena pedido={pedido} sena={cobro.sena} />}
      <Button variant="ghost" label="Volver al catálogo" onPress={alVolver} fullWidth />
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
    cuentas: { paddingTop: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    cifra: { fontVariant: ['tabular-nums'] },
  });
