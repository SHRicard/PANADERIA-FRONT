import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ClipboardCheck, Search } from 'lucide-react-native';
import { Alert, Button, CampoTexto, Input, ScreenContainer, Select, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { FilaProductoManual } from '../components/FilaProductoManual';
import { usePedidoManual } from '../hooks/usePedidoManual';

/**
 * Pedido manual (Más → Pedido manual): cargar un pedido que le hicieron al dueño por WhatsApp o en persona.
 * Queda como cualquier pedido, con la marca de cargado a mano, y sigue los mismos pasos en la pestaña Pedidos
 */
export function PedidoManualScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const manual = usePedidoManual();
  const { form } = manual;
  const elegidos = new Set(manual.elegidos.map(({ producto }) => producto._id));

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Para los pedidos que te hacen por WhatsApp o en persona. Queda en Pedidos como cualquier otro, y ahí le confirmás
          la seña y lo entregás.
        </Text>

        <View style={styles.seccion}>
          <Text variant="subtitle">Cliente</Text>
          {manual.clientes.length > 0 && (
            <Select
              label="¿Ya te hizo pedidos?"
              tituloHoja="Elegí el cliente"
              opciones={manual.clientes.map((cliente) => ({ valor: cliente._id, label: cliente.nombre, detalle: cliente.telefono }))}
              valor={manual.clienteElegido}
              alCambiar={manual.elegirCliente}
              placeholder="Elegilo de la lista, o escribí sus datos"
              helper="Opcional: completa el nombre y el teléfono."
            />
          )}
          <CampoTexto
            control={form.control}
            name="nombre"
            label="Nombre"
            placeholder="Doña Rosa"
            autoCapitalize="words"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => form.setFocus('telefono')}
          />
          <CampoTexto
            control={form.control}
            name="telefono"
            label="Teléfono"
            placeholder="11 5555-1234"
            helper="Con el teléfono se reconoce al cliente en sus próximos pedidos."
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Productos</Text>
          {manual.elegidos.length > 0 && (
            <View>
              {manual.elegidos.map(({ producto, cantidad }) => (
                <FilaProductoManual
                  key={producto._id}
                  producto={producto}
                  cantidad={cantidad}
                  max={manual.maxUnidades}
                  alCambiar={(nueva) => manual.cambiarCantidad(producto, nueva)}
                />
              ))}
              <View style={styles.total}>
                <Text variant="subtitle">Total</Text>
                <Text variant="subtitle" style={styles.cifra}>
                  {formatearPrecio(manual.total)}
                </Text>
              </View>
            </View>
          )}
          {manual.errorProductos && <Alert tone="danger" message={manual.errorProductos} />}

          <Input
            icon={Search}
            value={manual.texto}
            onChangeText={manual.setTexto}
            placeholder="Buscar un producto"
            accessibilityLabel="Buscar un producto"
            autoCapitalize="none"
            returnKeyType="search"
          />
          {manual.cargandoProductos && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}
          {manual.errorCargaProductos && (
            <View style={styles.error}>
              <Alert tone="danger" message={manual.errorCargaProductos} />
              <Button variant="secondary" label="Reintentar" onPress={manual.reintentarProductos} />
            </View>
          )}
          {!manual.cargandoProductos && !manual.errorCargaProductos && manual.productos.length === 0 && (
            <Text color="textMuted">Ningún producto coincide con «{manual.texto}».</Text>
          )}
          {/* Los ya elegidos están arriba, con el total */}
          <View>
            {manual.productos
              .filter((producto) => !elegidos.has(producto._id))
              .map((producto) => (
                <FilaProductoManual
                  key={producto._id}
                  producto={producto}
                  cantidad={0}
                  max={manual.maxUnidades}
                  alCambiar={(cantidad) => manual.cambiarCantidad(producto, cantidad)}
                />
              ))}
          </View>
          {manual.cargandoMasProductos ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : manual.hayMasProductos ? (
            <Button variant="ghost" label="Ver más productos" onPress={manual.cargarMasProductos} fullWidth />
          ) : null}
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Seña y nota</Text>
          <CampoTexto
            control={form.control}
            name="sena"
            label="Seña"
            placeholder={manual.total > 0 ? String(Math.round(manual.total / 2)) : '0'}
            helper="Opcional. Si ya te la transfirió, el pedido queda con la seña pagada."
            keyboardType="number-pad"
          />
          <CampoTexto
            control={form.control}
            name="nota"
            label="Nota"
            placeholder="Lo retira el sábado a la mañana"
            helper="Opcional. Para cuándo es, cómo lo quiere, lo que tengas que recordar."
            autoCapitalize="sentences"
            multiline
          />
        </View>

        {manual.error && <Alert tone="danger" message={manual.error} />}
        <Button icon={ClipboardCheck} label="Guardar pedido" onPress={() => void manual.guardar()} loading={manual.guardando} fullWidth />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    seccion: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.lg },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    total: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    cifra: { fontVariant: ['tabular-nums'] },
  });
