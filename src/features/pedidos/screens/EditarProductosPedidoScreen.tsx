import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Alert, Button, Cargando, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { BuscadorProductos } from '../components/BuscadorProductos';
import { FilaLineaPedido } from '../components/FilaLineaPedido';
import { useEditarProductosPedido } from '../hooks/useEditarProductosPedido';
import { ESTADO } from '../textos';

/**
 * «Editar productos» (/editar-pedido/[id]), desde el detalle de un pedido abierto: el cliente pidió sumar, sacar o
 * cambiar algo. Lo que ya estaba conserva su precio; lo nuevo entra con el de hoy. Es un formulario: sin tirar para
 * abajo (el gesto parecería que borra lo cambiado)
 */
export function EditarProductosPedidoScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const edicion = useEditarProductosPedido(id);
  const { pedido } = edicion;

  if (!pedido) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} llenarAlto>
        <View style={styles.lleno}>
          {edicion.cargando ? (
            <Cargando mensaje="Cargando el pedido…" llenarAlto />
          ) : edicion.noExiste ? (
            <View style={styles.bloque}>
              <Text variant="subtitle">Este pedido no existe</Text>
              <Button variant="secondary" icon={ArrowLeft} label="Volver" onPress={edicion.volver} />
            </View>
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={edicion.errorCarga ?? 'No se pudo cargar el pedido'} />
              <Button variant="secondary" label="Reintentar" onPress={edicion.reintentar} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  // Lo entregaron o lo cancelaron (acá o en otro dispositivo): ya no se puede tocar
  if (!edicion.sePuedeEditar) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']}>
        <View style={styles.bloque}>
          <Alert
            tone="warning"
            message={`Este pedido está ${ESTADO[pedido.estado].label.toLowerCase()}: ya no se pueden cambiar sus productos.`}
          />
          <Button variant="secondary" icon={ArrowLeft} label="Volver al pedido" onPress={edicion.volver} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <View style={styles.seccion}>
          <Text variant="title">Pedido de {pedido.clienteNombre}</Text>
          <Text color="textMuted">
            Lo que ya estaba conserva el precio con el que se pidió. Lo que sumes entra con el precio de hoy.
          </Text>
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">En el pedido</Text>
          <View>
            {edicion.lineas.map((linea) => (
              <FilaLineaPedido
                key={linea.productoId}
                linea={linea}
                max={edicion.maxUnidades}
                alCambiar={(cantidad) => edicion.cambiarCantidad(linea.productoId, cantidad)}
              />
            ))}
          </View>
          <View style={[styles.fila, styles.total]}>
            <Text variant="subtitle">Total</Text>
            <Text variant="subtitle" style={styles.cifra}>
              {formatearPrecio(edicion.total)}
            </Text>
          </View>
          {edicion.total !== pedido.total && (
            <Text variant="caption" color="textMuted" align="right" style={styles.cifra}>
              Antes {formatearPrecio(pedido.total)}
            </Text>
          )}
          {/* Sin seña (0) no salen: falta cobrar todo el total */}
          {pedido.sena && pedido.sena.monto > 0 && (
            <>
              <View style={styles.fila}>
                <Text color="textMuted">Seña</Text>
                <Text color="textMuted" style={styles.cifra}>
                  − {formatearPrecio(pedido.sena.monto)}
                </Text>
              </View>
              <View style={styles.fila}>
                <Text variant="label">Falta cobrar</Text>
                <Text variant="label" color={edicion.saldo < 0 ? 'danger' : 'text'} style={styles.cifra}>
                  {formatearPrecio(edicion.saldo)}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Sumar productos</Text>
          <BuscadorProductos
            buscador={edicion.buscador}
            ocultos={edicion.enLista}
            max={edicion.maxUnidades}
            alCambiar={(producto, cantidad) => edicion.cambiarCantidad(producto._id, cantidad, producto)}
          />
        </View>

        {edicion.error && <Alert tone="danger" message={edicion.error} />}
        <Button
          icon={Save}
          label="Guardar cambios"
          onPress={edicion.guardar}
          loading={edicion.guardando}
          disabled={!edicion.hayCambios}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    lleno: { flexGrow: 1 },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    seccion: { gap: theme.spacing.md },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
    total: { paddingTop: theme.spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    cifra: { fontVariant: ['tabular-nums'] },
  });
