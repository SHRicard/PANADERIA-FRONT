import { StyleSheet, View } from 'react-native';
import type { Control } from 'react-hook-form';
import { Alert, Button, CampoTexto, HojaInferior, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { LARGO_NOMBRE_IP } from '../schemas';
import type { FormularioNombreIp, IpLog } from '../types';

interface HojaNombreIpProps {
  /** La IP a la que se le pone nombre; null = cerrada */
  ip: IpLog | null;
  control: Control<FormularioNombreIp>;
  alCerrar: () => void;
  alGuardar: () => void;
  guardando: boolean;
  error: string | null;
}

/** Ponerle un nombre a una IP («Juan», «La compu del local»): después se ve en sus peticiones en vez de los números */
export function HojaNombreIp({ ip, control, alCerrar, alGuardar, guardando, error }: HojaNombreIpProps) {
  const styles = useStyles(createStyles);

  return (
    <HojaInferior
      visible={ip !== null}
      alCerrar={alCerrar}
      titulo={ip?.nombre ? 'Cambiar el nombre' : 'Ponerle nombre'}
      pie={<Button label="Guardar" onPress={alGuardar} loading={guardando} fullWidth />}
    >
      <View style={styles.hoja}>
        {ip && (
          <Text variant="caption" color="textMuted">
            IP {ip.ip}
          </Text>
        )}
        <CampoTexto
          control={control}
          name="nombre"
          label="¿De quién es?"
          placeholder="Juan, la compu del local…"
          helper="Es una pista: la IP de un celular cambia seguido y muchos pueden compartir la misma."
          maxLength={LARGO_NOMBRE_IP.max}
          autoCapitalize="sentences"
        />
        {error && <Alert tone="danger" message={error} />}
      </View>
    </HojaInferior>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    hoja: { gap: theme.spacing.md },
  });
