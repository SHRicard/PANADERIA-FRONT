import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { Adorno, Alert, Button, CampoTexto, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { ItemPedido } from '../components/ItemPedido';
import { PedidoConfirmado } from '../components/PedidoConfirmado';
import { usePedido } from '../hooks/usePedido';

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * «Tu pedido» (/pedido): lo que hay en el carrito con los precios de hoy, los datos del cliente y
 * confirmar. Después de confirmar muestra el pedido como lo guardó el back
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
          <PedidoConfirmado pedido={pedido.confirmado} alVolver={pedido.verCatalogo} />
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
          <View style={[styles.cuerpo, enCompu && styles.cuerpoCompu]}>
            {/* En la compu, dos columnas: el pedido a la izquierda y los datos a la derecha */}
            <View style={[styles.columna, enCompu && styles.columnaPedido]}>
              <View style={styles.titulo}>
                <Text variant="display" accessibilityRole="header">
                  Tu pedido
                </Text>
                <Text color="textMuted">Revisá lo que elegiste. Los precios son los de hoy.</Text>
              </View>

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
                        alCambiar={(cantidad) => carrito.cambiarCantidad(item.productoId, cantidad)}
                      />
                    </View>
                  ))}
                  <View style={styles.total}>
                    <View>
                      <Text variant="subtitle">Total</Text>
                      <Text variant="caption" color="textMuted">
                        {productos(carrito.unidades)}
                      </Text>
                    </View>
                    {/* Mientras se cotiza un cambio, el total viejo no se muestra como si fuera el nuevo */}
                    {pedido.cotizando ? (
                      <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                      <Text variant="title" style={styles.cifra}>
                        {formatearPrecio(cotizacion.total)}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {!enCompu && <Adorno forma="izquierda" />}

            <View style={[styles.columna, enCompu && styles.columnaDatos]}>
              <View style={styles.titulo}>
                <Text variant="subtitle">Tus datos</Text>
                <Text variant="caption" color="textMuted">
                  Para contactarte por tu pedido. No hace falta crear una cuenta.
                </Text>
              </View>
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
            </View>
          </View>
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
    cuerpo: { gap: theme.spacing.lg },
    cuerpoCompu: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xxxl },
    columna: { gap: theme.spacing.lg },
    columnaPedido: { flex: 3, minWidth: 0 },
    columnaDatos: { flex: 2, minWidth: 0 },
    volver: { alignItems: 'flex-start' },
    titulo: { gap: theme.spacing.xs },
    cargando: { paddingVertical: theme.spacing.xl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
    separado: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    total: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    cifra: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
  });
