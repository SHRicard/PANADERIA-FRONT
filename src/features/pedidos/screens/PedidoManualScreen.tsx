import { StyleSheet, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { ClipboardCheck } from 'lucide-react-native';
import { Alert, Button, CampoTexto, ScreenContainer, Segmentado, Select, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { BuscadorProductos } from '../components/BuscadorProductos';
import { FilaProductoManual } from '../components/FilaProductoManual';
import { usePedidoManual } from '../hooks/usePedidoManual';
import { OPCIONES_ENTREGA } from '../textos';

/**
 * Pedido manual (Más → Pedido manual): cargar un pedido que le hicieron al dueño por WhatsApp o en persona.
 * Queda como cualquier pedido, con la marca de cargado a mano, y sigue los mismos pasos en la pestaña Pedidos
 */
export function PedidoManualScreen() {
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

          {/* Los ya elegidos están arriba, con el total */}
          <BuscadorProductos buscador={manual.buscador} ocultos={elegidos} max={manual.maxUnidades} alCambiar={manual.cambiarCantidad} />
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">¿Cómo lo recibe?</Text>
          <Controller
            control={form.control}
            name="conEnvio"
            render={({ field }) => (
              <Segmentado
                opciones={OPCIONES_ENTREGA}
                valor={field.value ? 'envio' : 'retiro'}
                alCambiar={(valor) => field.onChange(valor === 'envio')}
                accessibilityLabel="Cómo recibe el pedido"
              />
            )}
          />
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
            placeholder="Para el sábado a la mañana"
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
    total: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    cifra: { fontVariant: ['tabular-nums'] },
  });
