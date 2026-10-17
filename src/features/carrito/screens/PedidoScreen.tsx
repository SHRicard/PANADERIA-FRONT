import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ArrowLeft, Plus, ShoppingBag } from 'lucide-react-native';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { Adorno, Alert, Button, CampoTexto, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { ItemPedido } from '../components/ItemPedido';
import { PedidoConfirmado } from '../components/PedidoConfirmado';
import { ResumenPedido } from '../components/ResumenPedido';
import { TituloPaso } from '../components/TituloPaso';
import { usePedido } from '../hooks/usePedido';

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * «Tu pedido» (/pedido), en tres pasos, en el orden en que se hace: 1 lo que eligió, 2 el resumen (total,
 * seña, el resto y cuándo está listo) y 3 sus datos para confirmar. En la compu, los productos a la izquierda
 * y el resumen con los datos a la derecha, bajo el mismo título. Después de confirmar muestra el pedido como
 * lo guardó el back
 */
export function PedidoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const pedido = usePedido();
  const refresco = useRefrescar(pedido.refrescar);
  const { carrito, cotizacion } = pedido;
  const vacio = carrito.items.length === 0;
  const enCompu = useBreakpoint() === 'compu';

  return (
    <ScreenContainer width="completo" refreshControl={refresco.control}>
      <View style={[styles.contenido, enCompu && styles.contenidoCompu]}>
        <View style={styles.volver}>
          <Button variant="ghost" size="sm" icon={ArrowLeft} label="Catálogo" onPress={pedido.volver} accessibilityLabel="Volver al catálogo" />
        </View>

        {pedido.confirmado ? (
          <PedidoConfirmado
            pedido={pedido.confirmado}
            cobro={pedido.cobroConfirmado}
            entrega={pedido.entregaConfirmado}
            alVolver={pedido.verCatalogo}
          />
        ) : vacio ? (
          <View style={styles.vacio}>
            <Icon icon={ShoppingBag} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              Tu pedido está vacío
            </Text>
            <Text color="textMuted" align="center">
              Elegí lo que gustes del catálogo con el «+» de cada producto.
            </Text>
            {pedido.quitados > 0 && (
              <Alert tone="warning" message="Lo que tenías ya no está disponible: lo sacamos de tu pedido." />
            )}
            <Button label="Ver el catálogo" onPress={pedido.verCatalogo} />
          </View>
        ) : (
          <>
            <View style={styles.encabezado}>
              <Text variant="display" accessibilityRole="header">
                Tu pedido
              </Text>
              <Text color="textMuted">
                Revisá lo que elegiste, mirá la seña y dejanos tus datos. Los precios son los de hoy.
              </Text>
              <View style={styles.adorno}>
                <Adorno forma="izquierda" />
              </View>
            </View>

            <View style={[styles.cuerpo, enCompu && styles.cuerpoCompu]}>
              {/* 1 · Lo que elegiste */}
              <View style={[styles.paso, enCompu && styles.columnaProductos]}>
                <TituloPaso numero={1} titulo="Lo que elegiste" detalle={productos(carrito.unidades)} />

                {pedido.quitados > 0 && (
                  <Alert
                    tone="warning"
                    message={
                      pedido.quitados === 1
                        ? 'Un producto ya no está disponible: lo sacamos de tu pedido.'
                        : `${pedido.quitados} productos ya no están disponibles: los sacamos de tu pedido.`
                    }
                  />
                )}
                {pedido.errorCotizacion && (
                  <View style={styles.error}>
                    <Alert tone="danger" message={pedido.errorCotizacion} />
                    <Button variant="secondary" label="Reintentar" onPress={() => void pedido.refrescar()} />
                  </View>
                )}
                {!cotizacion && !pedido.errorCotizacion && !refresco.refrescando ? (
                  <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
                ) : null}

                {cotizacion && (
                  <View>
                    {cotizacion.items.map((item, indice) => (
                      <View key={item.productoId} style={indice > 0 && styles.separado}>
                        <ItemPedido
                          item={item}
                          cantidad={carrito.cantidadDe(item.productoId)}
                          max={carrito.maxUnidades}
                          anticipacion={pedido.anticipacionDe(item.productoId)}
                          alCambiar={(cantidad) => carrito.cambiarCantidad(item.productoId, cantidad)}
                        />
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.agregar}>
                  <Button variant="ghost" size="sm" icon={Plus} label="Agregar más productos" onPress={pedido.volver} />
                </View>
              </View>

              <View style={[styles.columnaCuentas, enCompu && styles.columnaCuentasCompu]}>
                {/* 2 · Resumen */}
                <View style={styles.paso}>
                  <TituloPaso numero={2} titulo="Resumen" />
                  <ResumenPedido
                    unidades={carrito.unidades}
                    total={cotizacion && !pedido.cotizando ? cotizacion.total : null}
                    cobro={pedido.cobro}
                    entrega={pedido.entrega}
                  />
                </View>

                {/* 3 · Tus datos */}
                <View style={styles.paso}>
                  <TituloPaso numero={3} titulo="Tus datos" />
                  <Text variant="caption" color="textMuted">
                    Para contactarte por tu pedido. No hace falta crear una cuenta.
                  </Text>
                  <CampoTexto
                    control={pedido.form.control}
                    name="nombre"
                    label="Nombre"
                    placeholder="María"
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => pedido.form.setFocus('telefono')}
                  />
                  <CampoTexto
                    control={pedido.form.control}
                    name="telefono"
                    label="Teléfono"
                    placeholder="11 5555-1234"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => pedido.form.setFocus('nota')}
                  />
                  <CampoTexto
                    control={pedido.form.control}
                    name="nota"
                    label="Nota"
                    placeholder="Sin azúcar impalpable"
                    helper="Opcional. Algo que tengamos que saber del pedido."
                    autoCapitalize="sentences"
                    multiline
                  />
                  {pedido.error && <Alert tone="danger" message={pedido.error} />}
                  <Button
                    label="Confirmar pedido"
                    onPress={pedido.confirmar}
                    loading={pedido.enviando}
                    disabled={!cotizacion || pedido.cotizando}
                    fullWidth
                  />
                  <Text variant="caption" color="textMuted" align="center">
                    Te escribimos al teléfono que dejaste para coordinar la seña y la entrega.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // El mismo ancho que la carta: una columna en el celular y la tableta, el 80% de la ventana en la compu
    contenido: { gap: theme.spacing.lg, width: '100%', maxWidth: theme.sizes.cartaMax, alignSelf: 'center' },
    contenidoCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    volver: { alignItems: 'flex-start' },
    encabezado: { gap: theme.spacing.xs },
    adorno: { paddingTop: theme.spacing.sm },
    // Los pasos, uno debajo del otro; en la compu, el 1 a la izquierda y el 2 y el 3 a la derecha
    cuerpo: { gap: theme.spacing.xxl },
    cuerpoCompu: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xxxl },
    columnaProductos: { flex: 3, minWidth: 0 },
    columnaCuentas: { gap: theme.spacing.xxl },
    columnaCuentasCompu: { flex: 2, minWidth: 0 },
    paso: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
    separado: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    agregar: { alignItems: 'flex-start' },
  });
