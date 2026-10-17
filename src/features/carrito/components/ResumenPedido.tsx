import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { SENA_PORCENTAJE, type Cobro, type Entrega } from '../sena';

interface ResumenPedidoProps {
  unidades: number;
  /** null mientras se cotiza un cambio: el total viejo no se muestra como si fuera el nuevo */
  total: number | null;
  cobro: Cobro | null;
  /** null si todavía no se sabe la anticipación de los productos */
  entrega: Entrega | null;
}

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/** Las cuentas del pedido: el total, la seña para confirmarlo, el resto en la entrega y cuándo está listo */
export function ResumenPedido({ unidades, total, cobro, entrega }: ResumenPedidoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.resumen}>
      <View style={styles.fila}>
        <View style={styles.textos}>
          <Text variant="subtitle">Total</Text>
          <Text variant="caption" color="textMuted">
            {productos(unidades)}
          </Text>
        </View>
        {total === null ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Text variant="title" style={styles.cifra}>
            {formatearPrecio(total)}
          </Text>
        )}
      </View>

      <View style={styles.cuentas}>
        <View style={styles.fila}>
          <View style={styles.textos}>
            <Text variant="label" color="primary" style={styles.destacado}>
              Seña para confirmar ({SENA_PORCENTAJE}%)
            </Text>
            <Text variant="caption" color="textMuted">
              Se paga por adelantado para que empecemos a prepararlo.
            </Text>
          </View>
          <Text variant="subtitle" color={cobro ? 'primary' : 'textMuted'} style={styles.cifra}>
            {cobro ? formatearPrecio(cobro.sena) : '…'}
          </Text>
        </View>
        <View style={styles.fila}>
          <Text color="textMuted" style={styles.textos}>
            El resto, en la entrega
          </Text>
          <Text color="textMuted" style={styles.resto}>
            {cobro ? formatearPrecio(cobro.resto) : '…'}
          </Text>
        </View>
      </View>

      {entrega && (
        <View style={styles.entrega} accessibilityLiveRegion="polite">
          <Icon icon={Clock} color="primary" />
          <View style={styles.textos}>
            <Text variant="bodyStrong">{entrega.texto}</Text>
            {entrega.aclaracion && (
              <Text variant="caption" color="textMuted">
                {entrega.aclaracion}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    resumen: { gap: theme.spacing.md },
    fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
    cifra: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    destacado: { fontFamily: theme.fonts.textoNegrita },
    resto: { fontVariant: ['tabular-nums'] },
    // La seña y el resto, separados del total por una línea: son cómo se paga ese total
    cuentas: {
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    // Lo que más tiene que ver el cliente: cuándo lo tiene
    entrega: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
    },
  });
