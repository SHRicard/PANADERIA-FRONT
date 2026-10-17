import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { fechaLarga } from '../fechas';
import { textoEntrada, variacion } from '../textos';
import type { LogInsumo } from '../types';

interface EntradaHistorialProps {
  log: LogInsumo;
  /** La entrada anterior (más vieja), para mostrar cuánto subió o bajó el precio. La primera no tiene */
  anterior?: LogInsumo;
}

/** Una entrada del historial: el precio y el día de la compra, qué cambió y cuánto varió el precio */
export function EntradaHistorial({ log, anterior }: EntradaHistorialProps) {
  const styles = useStyles(createStyles);
  const cambio = anterior ? variacion(log.precio, anterior.precio) : null;

  return (
    <View style={styles.entrada}>
      <View style={styles.fila}>
        <Text variant="bodyStrong" style={styles.cifra}>
          {formatearPrecio(log.precio)}
          {cambio ? <Text color={cambio.startsWith('+') ? 'danger' : 'success'}>{`  ${cambio}`}</Text> : null}
        </Text>
        <Text color="textMuted">{fechaLarga(log.fecha)}</Text>
      </View>
      <Text variant="caption" color="textMuted">
        {textoEntrada(log)}
        {log.cambios.includes('nombre') ? `: ahora «${log.nombre}»` : ''}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    entrada: {
      gap: theme.spacing.xxs,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: theme.spacing.md },
    cifra: { fontVariant: ['tabular-nums'] },
  });
