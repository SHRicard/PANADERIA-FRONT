import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CalendarCheck, CalendarX, CookingPot } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { tituloDelDia } from '../agenda';
import { HojaProduccion } from '../components/HojaProduccion';
import { QuiereHacerDia } from '../components/QuiereHacerDia';
import { TarjetaPedido } from '../components/TarjetaPedido';
import { useDiaAgenda } from '../hooks/useDiaAgenda';
import { textoUnidades } from '../textos';

const textoPedidos = (cantidad: number) => (cantidad === 1 ? '1 pedido' : `${cantidad} pedidos`);

/**
 * Un día de la agenda (/agenda/[fecha]): se abre tocando el día en el calendario del inicio. Sus números, si está
 * cerrado para la web, «¿Cuántos querés hacer este día?» (menos que su tope, solo ese día), «Qué hay que hacer» (los productos sumados de sus pedidos), «Agenda llena» y sus pedidos, con
 * los cancelados aparte al final
 */
export function DiaAgendaScreen() {
  const styles = useStyles(createStyles);
  const { fecha } = useLocalSearchParams<{ fecha: string }>();
  const agenda = useDiaAgenda(fecha);
  const refresco = useRefrescar(agenda.refrescar);
  const { dia } = agenda;

  if (agenda.invalida) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']}>
        <Alert tone="danger" message="No encontramos ese día. Volvé al inicio y elegilo en el calendario." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
      <View style={styles.contenido}>
        <View style={styles.encabezado}>
          <Text variant="title" accessibilityRole="header">
            {tituloDelDia(agenda.fecha)}
          </Text>
          {dia && (
            <Text color="textMuted">
              {textoPedidos(dia.pedidos)} · {textoUnidades(dia.productos)}
              {/* Si ese día quiere hacer menos, el «de» es lo que quiere hacer */}
              {dia.quiereHacer ? ` de ${dia.quiereHacer}` : agenda.productosPorDia ? ` de ${agenda.productosPorDia}` : ''}
            </Text>
          )}
        </View>

        {agenda.cargando && !refresco.refrescando && <Cargando mensaje="Cargando el día…" llenarAlto />}
        {agenda.errorCarga && (
          <View style={styles.error}>
            <Alert tone="danger" message={agenda.errorCarga} />
            <Button variant="secondary" size="sm" label="Reintentar" onPress={agenda.reintentar} />
          </View>
        )}

        {dia?.llena ? (
          <Alert tone="warning" message="Agenda llena: la web no ofrece este día. Vos podés seguir cargando pedidos." />
        ) : (
          dia?.tope && (
            <Alert
              tone="warning"
              message="Llegaste a tu tope. La web lo sigue ofreciendo: si no querés más pedidos para este día, tocá «Agenda llena»."
            />
          )
        )}
        {agenda.error && <Alert tone="danger" message={agenda.error} />}

        {dia && !agenda.yaPaso && <QuiereHacerDia quiereHacer={agenda.quiereHacer} productosPorDia={agenda.productosPorDia} />}

        {dia && (
          <View style={styles.acciones}>
            {dia.pedidos > 0 && (
              <Button
                icon={CookingPot}
                label="Qué hay que hacer"
                onPress={agenda.produccion.abrir}
                accessibilityHint="Abre los productos de este día sumados, sin importar de quién es cada pedido"
                fullWidth
              />
            )}
            <Button
              variant={dia.llena ? 'secondary' : 'danger'}
              icon={dia.llena ? CalendarCheck : CalendarX}
              label={dia.llena ? 'Volver a abrir el día' : 'Agenda llena'}
              onPress={agenda.cambiarLlena}
              loading={agenda.cambiandoLlena}
              fullWidth
            />
          </View>
        )}

        {dia && (
          <View style={styles.pedidos}>
            <Text variant="subtitle" accessibilityRole="header">
              Pedidos
            </Text>
            {agenda.cargandoPedidos && !refresco.refrescando && <Cargando tamano="chico" mensaje="Cargando los pedidos del día" />}
            {agenda.errorPedidos && <Alert tone="danger" message={agenda.errorPedidos} />}
            {!agenda.cargandoPedidos && !agenda.errorPedidos && agenda.pedidos.length === 0 && agenda.cancelados.length === 0 && (
              // Los de la web no avisan: llegan al tirar para abajo
              <Text color="textMuted">No hay pedidos para este día. Si un cliente acaba de pedir, tirá para abajo.</Text>
            )}
            {!agenda.cargandoPedidos && agenda.pedidos.length === 0 && agenda.cancelados.length > 0 && (
              <Text color="textMuted">No hay pedidos activos para este día.</Text>
            )}
            {agenda.pedidos.map((pedido) => (
              <TarjetaPedido key={pedido._id} pedido={pedido} onPress={() => agenda.abrirPedido(pedido)} />
            ))}

            {/* Los cancelados no cuentan en los números de arriba: aparte y al final, para que no se contradigan */}
            {agenda.cancelados.length > 0 && (
              <View style={styles.cancelados}>
                <Text variant="subtitle" accessibilityRole="header">
                  Cancelados ({agenda.cancelados.length})
                </Text>
                <Text variant="caption" color="textMuted">
                  No cuentan en los pedidos ni en los productos del día.
                </Text>
              </View>
            )}
            {agenda.cancelados.map((pedido) => (
              <TarjetaPedido key={pedido._id} pedido={pedido} onPress={() => agenda.abrirPedido(pedido)} />
            ))}
            {agenda.hayMasPedidos && <Button variant="ghost" label="Ver más pedidos de este día" onPress={agenda.cargarMasPedidos} fullWidth />}
          </View>
        )}
      </View>

      <HojaProduccion agenda={agenda} />
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.lg },
    encabezado: { gap: theme.spacing.xs },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    acciones: { gap: theme.spacing.md },
    pedidos: {
      gap: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    cancelados: {
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
  });
