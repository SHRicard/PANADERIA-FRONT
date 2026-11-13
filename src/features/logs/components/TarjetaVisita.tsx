import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NIVELES_LOG } from '../schemas';
import {
  NIVEL,
  formatearNumero,
  nombreConIp,
  rangoVisita,
  textoClientes,
  textoDuracionVisita,
  textoPeticiones,
} from '../textos';
import type { Visita } from '../types';
import { FilaPeticion } from './FilaPeticion';

interface TarjetaVisitaProps {
  visita: Visita;
  onAbrirPedido: (id: string) => void;
}

/**
 * Una visita: quién (el nombre de la IP o la IP), cuándo y cuánto duró, quién pidió, cuántas peticiones y cómo les
 * fue. Las peticiones se despliegan con «Ver las N peticiones» (el back manda las primeras 50)
 */
function TarjetaVisitaComponent({ visita, onAbrirPedido }: TarjetaVisitaProps) {
  const styles = useStyles(createStyles);
  const [abierta, setAbierta] = useState(false);
  const clientes = textoClientes(visita);
  const faltan = visita.totalPeticiones - visita.peticiones.length;

  return (
    <View style={[styles.tarjeta, visita.sospechosos > 0 && styles.sospechosa]}>
      <View style={styles.arriba}>
        <Text variant="bodyStrong" style={styles.quien} numberOfLines={1}>
          {nombreConIp(visita.ip, visita.nombreIp)}
        </Text>
        <Text variant="caption" color="textMuted">
          {textoDuracionVisita(visita.duracionSegundos)}
        </Text>
      </View>
      <Text variant="caption" color="textMuted">
        {rangoVisita(visita.inicio, visita.fin)}
      </Text>

      {clientes && <Text variant="caption">{clientes}</Text>}

      <View style={styles.niveles}>
        <Text variant="caption">{textoPeticiones(visita.totalPeticiones)}</Text>
        {NIVELES_LOG.filter((nivel) => visita.porNivel[nivel] > 0).map((nivel) => (
          <View key={nivel} style={styles.nivel} accessible accessibilityLabel={`${visita.porNivel[nivel]} ${NIVEL[nivel].plural}`}>
            <Icon icon={NIVEL[nivel].icono} size="xs" color={NIVEL[nivel].color} />
            <Text variant="caption">{formatearNumero(visita.porNivel[nivel])}</Text>
          </View>
        ))}
        {visita.sospechosos > 0 && (
          <View style={styles.nivel}>
            <Icon icon={ShieldAlert} size="xs" color="danger" />
            <Text variant="caption" color="danger">
              {visita.sospechosos === 1 ? '1 sospechosa' : `${formatearNumero(visita.sospechosos)} sospechosas`}
            </Text>
          </View>
        )}
      </View>

      {abierta && (
        <View style={styles.peticiones}>
          {visita.peticiones.map((peticion) => (
            <FilaPeticion key={peticion.id} peticion={peticion} onAbrirPedido={onAbrirPedido} />
          ))}
          {faltan > 0 && (
            <Text variant="caption" color="textMuted">
              Y {textoPeticiones(faltan)} más: están en la vista Peticiones.
            </Text>
          )}
        </View>
      )}

      <View style={styles.boton}>
        <Button
          variant="ghost"
          size="sm"
          icon={abierta ? ChevronUp : ChevronDown}
          label={abierta ? 'Ocultar' : visita.totalPeticiones === 1 ? 'Ver la petición' : `Ver las ${formatearNumero(visita.totalPeticiones)} peticiones`}
          onPress={() => setAbierta((a) => !a)}
        />
      </View>
    </View>
  );
}

export const TarjetaVisita = memo(TarjetaVisitaComponent);

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
    quien: { flex: 1 },
    niveles: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.md },
    nivel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    peticiones: { paddingTop: theme.spacing.xs, borderTopWidth: 1, borderTopColor: theme.colors.border },
    boton: { alignItems: 'flex-start' },
  });
