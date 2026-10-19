import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Icon, ScreenContainer, Segmentado, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { Periodo } from '../rangos';
import { OPCIONES_PERIODO } from '../textos';

/** Lo que devuelve cada hook de métrica */
interface EstadoMetrica {
  cargando: boolean;
  actualizando: boolean;
  error: string | null;
  reintentar: () => void;
}

interface PantallaMetricaProps {
  /** Qué cuenta la métrica, arriba de todo */
  descripcion: string;
  periodo: Periodo;
  alCambiarPeriodo: (periodo: Periodo) => void;
  metrica: EstadoMetrica;
  /** El de `useRefrescar(metrica.refrescar)`: la pantalla se refresca tirando para abajo */
  refresco: ReturnType<typeof useRefrescar>;
  /** No hay nada en el período: va el estado vacío en vez del contenido */
  vacio: boolean;
  iconoVacio: LucideIcon;
  tituloVacio: string;
  detalleVacio: string;
  children: ReactNode;
}

/**
 * El armado de todas las pantallas de Métricas: qué cuenta, el período, la carga, el error, el vacío y el contenido.
 * Al cambiar de período se siguen viendo los datos anteriores, apagados y con la rueda encima; si no había, la rueda sola
 */
export function PantallaMetrica({
  descripcion,
  periodo,
  alCambiarPeriodo,
  metrica,
  refresco,
  vacio,
  iconoVacio,
  tituloVacio,
  detalleVacio,
  children,
}: PantallaMetricaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  // Mientras se tira para abajo, la única rueda es la del gesto
  const actualizando = metrica.actualizando && !refresco.refrescando;
  const esperando = (metrica.cargando && !refresco.refrescando) || (actualizando && vacio);
  const listo = !metrica.cargando && !metrica.error;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <Text color="textMuted">{descripcion}</Text>
        <Segmentado opciones={OPCIONES_PERIODO} valor={periodo} alCambiar={alCambiarPeriodo} accessibilityLabel="Período" />

        {esperando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

        {metrica.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={metrica.error} />
            <Button variant="secondary" label="Reintentar" onPress={metrica.reintentar} />
          </View>
        )}

        {listo && vacio && !esperando && (
          <View style={styles.vacio}>
            <Icon icon={iconoVacio} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              {tituloVacio}
            </Text>
            <Text color="textMuted" align="center">
              {detalleVacio}
            </Text>
          </View>
        )}

        {listo && !vacio && (
          <View>
            <View style={[styles.contenido, actualizando && styles.apagado]}>{children}</View>
            {actualizando && (
              <View style={styles.sobre} pointerEvents="none">
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            )}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
    apagado: { opacity: theme.opacity.disabled },
    sobre: { position: 'absolute', top: theme.spacing.xxl, left: theme.spacing.none, right: theme.spacing.none, alignItems: 'center' },
  });
