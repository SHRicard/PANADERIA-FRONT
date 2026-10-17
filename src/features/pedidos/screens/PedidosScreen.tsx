import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { PantallaPestana } from '@/features/navegacion';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Icon, Select, Text, type OpcionSelect } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TarjetaPedido } from '../components/TarjetaPedido';
import { usePedidos } from '../hooks/usePedidos';
import { ESTADO } from '../textos';
import type { EstadoPedido } from '../types';

const TODOS = 'todos';
const FILTROS: OpcionSelect<EstadoPedido | typeof TODOS>[] = [
  { valor: TODOS, label: 'Todos' },
  { valor: 'pendiente', label: ESTADO.pendiente.label },
  { valor: 'confirmado', label: ESTADO.confirmado.label },
  { valor: 'entregado', label: ESTADO.entregado.label },
  { valor: 'cancelado', label: ESTADO.cancelado.label },
];

const cantidad = (total: number) => (total === 1 ? '1 pedido' : `${total} pedidos`);

export function PedidosScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const lista = usePedidos();
  const refresco = useRefrescar(lista.refrescar);
  const vacio = !lista.cargando && !lista.error && lista.pedidos.length === 0;

  return (
    <PantallaPestana pestana="pedidos" refreshControl={refresco.control} alLlegarAlFinal={lista.cargarMas}>
      <View style={styles.contenido}>
        <View style={styles.filtros}>
          <Select
            label="Estado"
            opciones={FILTROS}
            valor={lista.estado ?? TODOS}
            alCambiar={(valor) => lista.setEstado(valor === TODOS ? null : valor)}
          />
          {!lista.cargando && !lista.error && lista.total > 0 && (
            <Text variant="caption" color="textMuted">
              {cantidad(lista.total)}
            </Text>
          )}
        </View>

        {lista.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

        {lista.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={lista.error} />
            <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
          </View>
        )}

        {vacio && (
          <View style={styles.vacio}>
            <Icon icon={ClipboardList} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              {lista.estado ? 'No hay pedidos en este estado' : 'Todavía no hay pedidos'}
            </Text>
            {!lista.estado && (
              <Text color="textMuted" align="center">
                Cuando un cliente haga un pedido desde la web, lo vas a ver acá.
              </Text>
            )}
          </View>
        )}

        {lista.pedidos.map((pedido) => (
          <TarjetaPedido key={pedido._id} pedido={pedido} onPress={() => lista.abrir(pedido)} />
        ))}

        {lista.cargandoMas ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.mas} />
        ) : lista.errorMas ? (
          <View style={styles.error}>
            <Alert tone="danger" message={lista.errorMas} />
            <Button variant="secondary" label="Reintentar" onPress={lista.cargarMas} />
          </View>
        ) : lista.hayMas ? (
          <Button variant="ghost" label="Ver más pedidos" onPress={lista.cargarMas} fullWidth />
        ) : null}
      </View>
    </PantallaPestana>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.md },
    filtros: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
    cargando: { paddingVertical: theme.spacing.xxl },
    mas: { paddingVertical: theme.spacing.lg },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
  });
