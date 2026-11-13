import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Badge, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { textoParaElDia } from '../agenda';
import { estadoDe, fechaYHora, MARCA_MANUAL, MARCA_NUEVO, marcaEnvio, textoUnidades } from '../textos';
import type { Pedido } from '../types';

interface TarjetaPedidoProps {
  pedido: Pedido;
  onPress: () => void;
}

/** Un pedido en la lista: quién, cuándo, cuánto, en qué estado está y si va con envío o retira. Si el dueño todavía no lo vio, resaltado y con «Nuevo» */
export function TarjetaPedido({ pedido, onPress }: TarjetaPedidoProps) {
  const styles = useStyles(createStyles);
  const unidades = pedido.items.reduce((suma, item) => suma + item.cantidad, 0);
  const estado = estadoDe(pedido);
  const envio = marcaEnvio(pedido.conEnvio);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${pedido.visto ? '' : `${MARCA_NUEVO}: `}Pedido de ${pedido.clienteNombre}, ${formatearPrecio(pedido.total)}, ${estado.label}, ${envio.label}`}
      accessibilityHint="Ver el detalle"
      style={({ pressed }) => [styles.tarjeta, !pedido.visto && styles.nueva, pressed && styles.presionada]}
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
        {/* Para cuándo es: lo que el dueño mira primero para organizarse */}
        <Text variant="bodyStrong">{textoParaElDia(pedido.fechaEntrega)}</Text>
        <Text variant="caption" color="textMuted">
          Pedido del {fechaYHora(pedido.createdAt)} · {textoUnidades(unidades)}
        </Text>
        <View style={styles.fila}>
          <View style={styles.marcas}>
            {!pedido.visto && <Badge tone="primary" label={MARCA_NUEVO} />}
            <Badge tone={estado.tone} label={estado.label} />
            <Badge tone={envio.tone} label={envio.label} />
            {pedido.origen === 'manual' && <Badge tone="neutral" label={MARCA_MANUAL} />}
          </View>
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
    // Sin ver: el borde y el fondo del color principal, así se distingue de un vistazo en la lista y en el inicio
    nueva: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
    presionada: { opacity: theme.opacity.pressed },
    datos: { flex: 1, gap: theme.spacing.xs },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    nombre: { flex: 1 },
    marcas: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, flexShrink: 1 },
    cifra: { fontVariant: ['tabular-nums'] },
    flecha: { justifyContent: 'center' },
  });
