import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Pencil, ShoppingBasket } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { EntradaHistorial } from '../components/EntradaHistorial';
import { fechaLarga } from '../fechas';
import { useInsumo } from '../hooks/useInsumo';

/** Un insumo: lo que pagó la última vez, cargar una compra nueva o corregirlo, y todo el historial */
export function InsumoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useInsumo(id);
  const refresco = useRefrescar(detalle.refrescar);
  const { insumo } = detalle;

  if (!insumo) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
        <View style={styles.contenido}>
          {detalle.cargando && !refresco.refrescando ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
          ) : detalle.noExiste ? (
            <View style={styles.bloque}>
              <Text variant="subtitle">Este insumo no existe</Text>
              <Button variant="secondary" icon={ArrowLeft} label="Volver a insumos" onPress={detalle.volver} />
            </View>
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={detalle.error ?? 'No se pudo cargar el insumo'} />
              <Button variant="secondary" label="Reintentar" onPress={detalle.reintentar} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <View style={styles.bloque}>
          <Text variant="title">{insumo.nombre}</Text>
          <Text variant="subtitle" color="primary" style={styles.cifra}>
            {formatearPrecio(insumo.precio)}
          </Text>
          <Text color="textMuted">Última compra: {fechaLarga(insumo.fecha)}</Text>
        </View>

        <View style={styles.acciones}>
          <Button icon={ShoppingBasket} label="Cargar compra nueva" onPress={detalle.cargarCompra} fullWidth />
          <Button variant="secondary" icon={Pencil} label="Corregir datos" onPress={detalle.corregir} fullWidth />
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Historial</Text>
          <Text variant="caption" color="textMuted">
            Cada alta, compra y corrección, la más nueva arriba.
          </Text>
          <View>
            {insumo.logs.map((log, indice) => (
              <EntradaHistorial key={log.id} log={log} anterior={insumo.logs[indice + 1]} />
            ))}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    cifra: { fontVariant: ['tabular-nums'] },
    acciones: { gap: theme.spacing.sm },
    seccion: { gap: theme.spacing.xs },
  });
