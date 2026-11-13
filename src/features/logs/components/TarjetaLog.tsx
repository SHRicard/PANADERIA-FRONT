import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { Badge, Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { MOTIVO_SOSPECHA, NIVEL, fechaLog, nombreApartado, quienEs, textoCodigo, textoDuracion } from '../textos';
import type { Log } from '../types';

interface TarjetaLogProps {
  log: Log;
  onAbrirPedido: (id: string) => void;
}

/**
 * Una petición: cuándo, quién (el nombre de la IP o la IP), qué pidió, cómo le fue y cuánto tardó. Si fue sospechosa,
 * el motivo en palabras y el borde rojo; si con ella se hizo un pedido, el botón para abrirlo
 */
function TarjetaLogComponent({ log, onAbrirPedido }: TarjetaLogProps) {
  const styles = useStyles(createStyles);
  const nivel = NIVEL[log.nivel];
  const apartado = nombreApartado(log.apartado);

  return (
    <View style={[styles.tarjeta, log.sospechoso && styles.sospechosa]}>
      <View style={styles.arriba}>
        <Badge label={`${nivel.label} · ${textoCodigo(log.codigo)}`} tone={nivel.tono} />
        <Text variant="caption" color="textMuted">
          {fechaLog(log.fecha)}
        </Text>
      </View>

      <View>
        {apartado && <Text variant="bodyStrong">{apartado}</Text>}
        <Text variant="caption" numberOfLines={2}>
          {log.metodo} {log.ruta}
        </Text>
      </View>

      <View style={styles.linea}>
        <Text variant="caption" color="textMuted" style={styles.quien} numberOfLines={1}>
          {quienEs(log)}
          {log.nombreIp ? ` (${log.ip})` : ''}
        </Text>
        {log.admin && <Badge label="App" tone="primary" />}
        <Text variant="caption" color="textMuted">
          {textoDuracion(log.ms)}
        </Text>
      </View>

      {log.sospechoso && (
        <View style={styles.motivo}>
          <Icon icon={ShieldAlert} size="xs" color="danger" />
          <Text variant="caption" color="danger">
            {MOTIVO_SOSPECHA[log.sospechoso]}
          </Text>
        </View>
      )}

      {log.mensaje && (
        <Text variant="caption" color="textMuted">
          {log.mensaje}
        </Text>
      )}

      {log.pedido && (
        <View style={styles.pedido}>
          <Button
            variant="ghost"
            size="sm"
            label={log.pedido.clienteNombre ? `Ver el pedido de ${log.pedido.clienteNombre}` : 'Ver el pedido'}
            onPress={() => log.pedido && onAbrirPedido(log.pedido.id)}
          />
        </View>
      )}
    </View>
  );
}

export const TarjetaLog = memo(TarjetaLogComponent);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    sospechosa: { borderColor: theme.colors.danger },
    arriba: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    linea: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    quien: { flex: 1 },
    motivo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    pedido: { alignItems: 'flex-start' },
  });
