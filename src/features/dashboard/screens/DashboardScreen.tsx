import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PantallaPestana } from '@/features/navegacion';
import { TarjetaPedido } from '@/features/pedidos';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TarjetaCatalogo } from '../components/TarjetaCatalogo';
import { TarjetaHoy } from '../components/TarjetaHoy';
import { useResumen } from '../hooks/useResumen';

// Inicio del admin: el atajo para compartir el catálogo y lo de hoy
export function DashboardScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const dia = useResumen();
  const refresco = useRefrescar(dia.refrescar);
  const { resumen } = dia;

  return (
    <PantallaPestana pestana="dashboard" refreshControl={refresco.control}>
      <TarjetaCatalogo />

      {dia.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

      {dia.error && (
        <View style={styles.error}>
          <Alert tone="danger" message={dia.error} />
          <Button variant="secondary" label="Reintentar" onPress={dia.reintentar} />
        </View>
      )}

      {resumen && (
        <>
          <TarjetaHoy resumen={resumen} />

          <View style={styles.seccion}>
            <Text variant="subtitle">Pedidos de hoy</Text>
            {resumen.ultimosPedidos.length === 0 ? (
              // Los de la web no recargan el inicio solos: llegan al tirar para abajo
              <Text color="textMuted">Cuando un cliente haga un pedido, tirá para abajo y lo vas a ver acá.</Text>
            ) : (
              resumen.ultimosPedidos.map((pedido) => (
                <TarjetaPedido key={pedido._id} pedido={pedido} onPress={() => dia.abrir(pedido)} />
              ))
            )}
            {dia.hayMasPedidos && (
              <Button variant="ghost" label="Ver los demás en Pedidos" onPress={dia.verPedidos} fullWidth />
            )}
          </View>
        </>
      )}
    </PantallaPestana>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    seccion: { gap: theme.spacing.md },
  });
