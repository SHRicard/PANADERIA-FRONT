import { StyleSheet, View } from 'react-native';
import { ESTADO, type EstadoPedido } from '@/features/pedidos';
import { Badge, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import type { Resumen } from '../types';

interface TarjetaHoyProps {
  resumen: Resumen;
}

const cantidad = (pedidos: number) => (pedidos === 1 ? '1 pedido' : `${pedidos} pedidos`);

/** Lo vendido hoy y lo que queda para atender (los abiertos son de cualquier día) */
export function TarjetaHoy({ resumen }: TarjetaHoyProps) {
  const styles = useStyles(createStyles);
  const { hoy, abiertos } = resumen;
  const nadaAbierto = abiertos.pendiente === 0 && abiertos.confirmado === 0;

  return (
    <View style={styles.tarjeta}>
      <View style={styles.bloque}>
        <Text variant="overline" color="textMuted">
          Vendido hoy
        </Text>
        <Text variant="heading" style={styles.cifra}>
          {formatearPrecio(hoy.vendido)}
        </Text>
        <Text variant="caption" color="textMuted">
          {hoy.pedidos === 0 ? 'Todavía no hay pedidos' : cantidad(hoy.pedidos)}
        </Text>
      </View>

      <View style={[styles.bloque, styles.separado]}>
        <Text variant="overline" color="textMuted">
          Para atender
        </Text>
        {nadaAbierto ? (
          <Text color="textMuted">No hay pedidos abiertos.</Text>
        ) : (
          (['pendiente', 'confirmado'] as const satisfies readonly EstadoPedido[]).map((estado) => (
            <View key={estado} style={styles.fila}>
              <Badge tone={ESTADO[estado].tone} label={ESTADO[estado].label} />
              <Text variant="bodyStrong" style={styles.cifra}>
                {abiertos[estado]}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    bloque: { gap: theme.spacing.xs },
    separado: { paddingTop: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.colors.border },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    cifra: { fontVariant: ['tabular-nums'] },
  });
