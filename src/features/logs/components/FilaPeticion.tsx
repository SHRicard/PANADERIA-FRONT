import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { MOTIVO_SOSPECHA, NIVEL, horaLog, nombreApartado, textoCodigo, textoDuracion } from '../textos';
import type { PeticionVisita } from '../types';

interface FilaPeticionProps {
  peticion: PeticionVisita;
  onAbrirPedido: (id: string) => void;
}

/**
 * Una petición adentro de una visita, en una línea corta: la hora, cómo le fue (ícono y código), qué pidió y cuánto
 * tardó. Abajo, si hace falta, el motivo de la sospecha, el mensaje y el pedido que se hizo
 */
function FilaPeticionComponent({ peticion, onAbrirPedido }: FilaPeticionProps) {
  const styles = useStyles(createStyles);
  const nivel = NIVEL[peticion.nivel];
  const apartado = nombreApartado(peticion.apartado);

  return (
    <View style={styles.fila}>
      <View style={styles.linea}>
        <Icon icon={nivel.icono} size="xs" color={nivel.color} />
        <Text variant="caption" color="textMuted">
          {horaLog(peticion.fecha)}
        </Text>
        <Text variant="caption" style={styles.que} numberOfLines={1}>
          {apartado ? `${apartado} · ` : ''}
          {peticion.metodo} {peticion.ruta}
        </Text>
      </View>
      <Text variant="caption" color="textMuted" style={styles.detalle}>
        {nivel.label} {textoCodigo(peticion.codigo)} · {textoDuracion(peticion.ms)}
      </Text>

      {peticion.sospechoso && (
        <View style={[styles.linea, styles.detalle]}>
          <Icon icon={ShieldAlert} size="xs" color="danger" />
          <Text variant="caption" color="danger">
            {MOTIVO_SOSPECHA[peticion.sospechoso]}
          </Text>
        </View>
      )}
      {peticion.mensaje && (
        <Text variant="caption" color="textMuted" style={styles.detalle}>
          {peticion.mensaje}
        </Text>
      )}
      {peticion.pedido && (
        <View style={styles.detalle}>
          <Button
            variant="ghost"
            size="sm"
            label={peticion.pedido.clienteNombre ? `Ver el pedido de ${peticion.pedido.clienteNombre}` : 'Ver el pedido'}
            onPress={() => peticion.pedido && onAbrirPedido(peticion.pedido.id)}
          />
        </View>
      )}
    </View>
  );
}

export const FilaPeticion = memo(FilaPeticionComponent);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { gap: theme.spacing.xxs, paddingVertical: theme.spacing.xs },
    linea: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    que: { flex: 1 },
    // Lo de abajo, alineado con el texto y no con el ícono
    detalle: { paddingLeft: theme.iconSize.xs + theme.spacing.xs, alignItems: 'flex-start' },
  });
