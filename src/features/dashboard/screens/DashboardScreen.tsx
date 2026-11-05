import { StyleSheet, View } from 'react-native';
import { AvisoWebCerrada, useEstadoNegocio } from '@/features/cierre';
import { PantallaPestana } from '@/features/navegacion';
import { TarjetaPedido } from '@/features/pedidos';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { TarjetaCatalogo } from '../components/TarjetaCatalogo';
import { TarjetaHoy } from '../components/TarjetaHoy';
import { useResumen } from '../hooks/useResumen';

// Inicio del admin: si la web está cerrada (para que no se olvide de abrirla), el atajo para compartir el catálogo
// y lo de hoy. Al tirar para abajo se recargan las dos cosas: el otro admin pudo haber abierto o cerrado la web
export function DashboardScreen() {
  const styles = useStyles(createStyles);
  const dia = useResumen();
  const negocio = useEstadoNegocio();
  const refresco = useRefrescar(() => Promise.all([dia.refrescar(), negocio.refrescar()]));
  const { resumen } = dia;

  return (
    <PantallaPestana pestana="dashboard" refreshControl={refresco.control} llenarAlto>
      <AvisoWebCerrada />
      <TarjetaCatalogo />

      {dia.cargando && !refresco.refrescando && <Cargando mensaje="Cargando lo de hoy…" llenarAlto style={styles.cargando} />}

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
