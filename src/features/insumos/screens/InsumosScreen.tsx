import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Plus, Wheat } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TarjetaInsumo } from '../components/TarjetaInsumo';
import { useInsumos } from '../hooks/useInsumos';

// Más → Insumos. El título lo pone el header del Stack
export function InsumosScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const lista = useInsumos();
  const refresco = useRefrescar(lista.refrescar);
  const vacio = !lista.cargando && !lista.error && lista.insumos.length === 0;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Lo que comprás para producir y cuánto pagaste. Cada vez que vuelvas a comprar algo, cargalo en ese mismo insumo:
          así queda el historial de precios.
        </Text>
        <Button icon={Plus} label="Nuevo insumo" onPress={lista.nuevo} fullWidth />

        {lista.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

        {lista.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={lista.error} />
            <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
          </View>
        )}

        {vacio && (
          <View style={styles.vacio}>
            <Icon icon={Wheat} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              Todavía no cargaste insumos
            </Text>
            <Text color="textMuted" align="center">
              Tocá «Nuevo insumo» para cargar el primero: por ejemplo, la harina que compraste este mes.
            </Text>
          </View>
        )}

        {lista.insumos.map((insumo) => (
          <TarjetaInsumo key={insumo._id} insumo={insumo} onPress={() => lista.abrir(insumo)} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
  });
