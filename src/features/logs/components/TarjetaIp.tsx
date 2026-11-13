import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, PencilLine, ShieldAlert } from 'lucide-react-native';
import { Badge, Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NIVELES_LOG } from '../schemas';
import { NIVEL, fechaCorta, formatearNumero, nombreApartado, rutaConMetodo, textoClientes, textoPeticiones } from '../textos';
import type { IpLog } from '../types';

interface TarjetaIpProps {
  ip: IpLog;
  /** Se le está sacando el nombre a esta */
  olvidando: boolean;
  onVerVisitas: (ip: IpLog) => void;
  onNombrar: (ip: IpLog) => void;
  onOlvidar: (ip: IpLog) => void;
}

/**
 * Una IP: el nombre que le puso el dueño (si tiene), quiénes pidieron desde ahí, cuántas peticiones y cómo les fue,
 * cuándo se vio, lo que más pidió y los botones para ver sus visitas y ponerle o sacarle el nombre
 */
function TarjetaIpComponent({ ip, olvidando, onVerVisitas, onNombrar, onOlvidar }: TarjetaIpProps) {
  const styles = useStyles(createStyles);
  const clientes = textoClientes(ip);

  return (
    <View style={[styles.tarjeta, ip.sospechosos > 0 && styles.sospechosa]}>
      <View style={styles.arriba}>
        <View style={styles.textos}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {ip.nombre ?? ip.ip}
          </Text>
          {ip.nombre && (
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {ip.ip}
            </Text>
          )}
        </View>
        {ip.admin && <Badge label="App" tone="primary" />}
      </View>

      {clientes && <Text variant="caption">{clientes}</Text>}

      <View style={styles.niveles}>
        <Text variant="caption">{textoPeticiones(ip.peticiones)}</Text>
        {NIVELES_LOG.filter((nivel) => ip.porNivel[nivel] > 0).map((nivel) => (
          <View key={nivel} style={styles.nivel}>
            <Icon icon={NIVEL[nivel].icono} size="xs" color={NIVEL[nivel].color} />
            <Text variant="caption">{formatearNumero(ip.porNivel[nivel])}</Text>
          </View>
        ))}
      </View>

      {ip.sospechosos > 0 && (
        <View style={styles.nivel}>
          <Icon icon={ShieldAlert} size="xs" color="danger" />
          <Text variant="caption" color="danger">
            {ip.sospechosos === 1 ? '1 sospechosa' : `${formatearNumero(ip.sospechosos)} sospechosas`}
          </Text>
        </View>
      )}

      <Text variant="caption" color="textMuted">
        Primera vez {fechaCorta(ip.primera)} · última {fechaCorta(ip.ultima)}
      </Text>

      {ip.apartados.length > 0 && (
        <View style={styles.apartados}>
          {ip.apartados.map((a) => (
            <Text key={`${a.metodo} ${a.apartado}`} variant="caption" color="textMuted" numberOfLines={1}>
              {nombreApartado(a.apartado) ?? rutaConMetodo(a.metodo, a.apartado)} · {formatearNumero(a.peticiones)}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.botones}>
        <Button variant="secondary" size="sm" icon={List} label="Ver sus visitas" onPress={() => onVerVisitas(ip)} />
        <Button
          variant="ghost"
          size="sm"
          icon={PencilLine}
          label={ip.nombre ? 'Cambiar nombre' : 'Ponerle nombre'}
          onPress={() => onNombrar(ip)}
        />
        {ip.nombre && (
          <Button
            variant="ghost"
            size="sm"
            label="Sacar el nombre"
            onPress={() => onOlvidar(ip)}
            loading={olvidando}
            accessibilityLabel={`Sacarle el nombre ${ip.nombre} a la IP ${ip.ip}`}
          />
        )}
      </View>
    </View>
  );
}

export const TarjetaIp = memo(TarjetaIpComponent);

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
    arriba: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    textos: { flex: 1, gap: theme.spacing.xxs },
    niveles: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.md },
    nivel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    apartados: { gap: theme.spacing.xxs },
    botones: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, paddingTop: theme.spacing.xs },
  });
