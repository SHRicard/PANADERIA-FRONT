import { StyleSheet, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { ArrowLeft, Car, Plus, ShoppingBag, Store } from 'lucide-react-native';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import {
  Adorno,
  Alert,
  Button,
  CalendarioMes,
  CampoTexto,
  Cargando,
  Icon,
  ScreenContainer,
  Segmentado,
  Text,
  type OpcionSegmentado,
} from '@/shared/ui/atoms';
import { BotonFiestas, IlustracionNavidad, Vivo } from '@/features/catalogo';
import { useStyles, useTheme, type Theme } from '@/theme';
import { EncabezadoPedidoNavidad } from '../components/EncabezadoPedidoNavidad';
import { DiaElegido } from '../components/DiaElegido';
import { HojaDiaLleno } from '../components/HojaDiaLleno';
import { ItemPedido } from '../components/ItemPedido';
import { PedidoConfirmado } from '../components/PedidoConfirmado';
import { ResumenPedido } from '../components/ResumenPedido';
import { TituloPaso } from '../components/TituloPaso';
import { usePedido } from '../hooks/usePedido';
import { TEXTO_ANTES_DE_CONFIRMAR, TEXTOS_PEDIDO_NAVIDAD } from '../textos';

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

type Entrega = 'retiro' | 'envio';
/** Cómo lo recibe: el form guarda `conEnvio` (boolean), el Segmentado elige entre estas dos */
const OPCIONES_ENTREGA: OpcionSegmentado<Entrega>[] = [
  { valor: 'retiro', label: 'Lo paso a retirar', icono: Store },
  { valor: 'envio', label: 'Con envío', icono: Car },
];

/**
 * «Tu pedido» (/pedido), en tres pasos, en el orden en que se hace: 1 lo que eligió, 2 el resumen (total,
 * seña, el resto y cuándo está listo) y 3 sus datos para confirmar. En cualquier ancho, uno debajo del otro como en el
 * celular, del mismo ancho que la carta y el detalle de un producto (`cartaMax`; el 80% de la ventana en la compu). Después de confirmar muestra el pedido como
 * lo guardó el back. De Navidad: arriba, la escena con la canasta navideña (`EncabezadoPedidoNavidad`), los números de los pasos con
 * muñequitos (uno por paso), el botón dorado de confirmar (`BotonFiestas`, de catalogo), el muñeco de nieve en el
 * pedido vacío y Papá Noel al confirmar
 */
export function PedidoScreen() {
  const tamano = useBreakpoint();
  const enCompu = tamano === 'compu';
  const enCelular = tamano === 'celular';
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const pedido = usePedido();
  const { navidad } = pedido;
  const refresco = useRefrescar(pedido.refrescar);
  const { carrito, cotizacion } = pedido;
  const vacio = carrito.items.length === 0;

  return (
    <ScreenContainer width="completo" refreshControl={refresco.control} volverArribaCon={pedido.confirmado?.id ?? null}>
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
            navidad={navidad}
          />
        ) : vacio ? (
          <View style={styles.vacio}>
            {navidad ? (
              <Vivo como="flotar">
                <IlustracionNavidad nombre="munecoNieveGorroPapaNoel" alto={theme.sizes.ilustracionVacio} />
              </Vivo>
            ) : (
              <Icon icon={ShoppingBag} size="xl" color="textMuted" />
            )}
            <Text variant="subtitle" align="center">
              {navidad ? TEXTOS_PEDIDO_NAVIDAD.vacio.titulo : 'Tu pedido está vacío'}
            </Text>
            <Text color="textMuted" align="center">
              {navidad ? TEXTOS_PEDIDO_NAVIDAD.vacio.texto : 'Elegí lo que gustes del catálogo con el «+» de cada producto.'}
            </Text>
            {pedido.quitados > 0 && (
              <Alert tone="warning" message="Lo que tenías ya no está disponible: lo sacamos de tu pedido." />
            )}
            <Button label="Ver el catálogo" onPress={pedido.verCatalogo} />
          </View>
        ) : (
          <>
            {navidad ? (
              <EncabezadoPedidoNavidad />
            ) : (
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
            )}

            <View style={styles.cuerpo}>
              {/* 1 · Lo que elegiste */}
              <View style={styles.paso}>
                <TituloPaso numero={1} titulo="Lo que elegiste" navidad={navidad} detalle={productos(carrito.unidades)} />

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
                  <Cargando mensaje="Calculando tu pedido…" style={styles.cargando} />
                ) : null}

                {cotizacion ? (
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
                ) : pedido.errorCotizacion ? (
                  // Sin cotización no hay precios, pero lo que eligió se sigue viendo (y se puede cambiar)
                  <View>
                    {pedido.itemsSinCotizar.map((item, indice) => (
                      <View key={item.productoId} style={indice > 0 && styles.separado}>
                        <ItemPedido
                          item={{ nombre: item.nombre, precio: null, portada: null }}
                          cantidad={carrito.cantidadDe(item.productoId)}
                          max={carrito.maxUnidades}
                          anticipacion={pedido.anticipacionDe(item.productoId)}
                          alCambiar={(cantidad) => carrito.cambiarCantidad(item.productoId, cantidad)}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}
                <View style={styles.agregar}>
                  <Button variant="ghost" size="sm" icon={Plus} label="Agregar más productos" onPress={pedido.volver} />
                </View>
              </View>

              <View style={styles.columnaCuentas}>
                {/* 2 · Resumen */}
                <View style={styles.paso}>
                  <TituloPaso numero={2} titulo="Resumen" navidad={navidad} />
                  <ResumenPedido
                    unidades={carrito.unidades}
                    total={cotizacion && !pedido.cotizando ? cotizacion.total : null}
                    cobro={pedido.cobro}
                    // El día va arriba de «Confirmar pedido» (DiaElegido): acá se repetía
                    entrega={null}
                  />
                </View>

                {/* 3 · Tus datos */}
                <View style={styles.paso}>
                  <TituloPaso numero={3} titulo="Tus datos" navidad={navidad} />
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
                  <Controller
                    control={pedido.form.control}
                    name="fechaEntrega"
                    render={({ field, fieldState }) => (
                      <View style={styles.campo}>
                        <Text variant="label">¿Para qué día?</Text>
                        {pedido.calendario ? (
                          <CalendarioMes
                            mes={pedido.calendario.mes}
                            dias={pedido.calendario.dias}
                            seleccionado={field.value || null}
                            alElegir={pedido.calendario.alElegir}
                            alRechazar={pedido.calendario.alRechazar}
                            alMesAnterior={pedido.calendario.alMesAnterior}
                            alMesSiguiente={pedido.calendario.alMesSiguiente}
                          />
                        ) : pedido.errorCotizacion ? (
                          // Sin cotización no hay días: el error y «Reintentar» están en el paso 1
                          <Text variant="caption" color="textMuted">
                            No pudimos traer los días disponibles. Tocá «Reintentar» arriba.
                          </Text>
                        ) : (
                          <Cargando tamano="chico" mensaje="Buscando los días disponibles" />
                        )}
                        {pedido.calendario?.aviso && (
                          <Text variant="caption" color="textMuted">
                            {pedido.calendario.aviso}
                          </Text>
                        )}
                        {fieldState.error && (
                          <Text variant="caption" color="danger">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                  {pedido.error && <Alert tone="danger" message={pedido.error} />}
                  {pedido.diaElegido && <DiaElegido texto={pedido.diaElegido} fiestas={navidad} />}
                  {/* Cómo lo recibe y «Confirmar pedido», mitad y mitad en la misma fila (en el celular, uno debajo del
                      otro): a lo ancho de la página, cada uno de punta a punta era demasiado */}
                  <View style={styles.campo}>
                    <Text variant="label">¿Cómo lo recibís?</Text>
                    <View style={[styles.cierre, !enCelular && styles.cierreAncho]}>
                      <Controller
                        control={pedido.form.control}
                        name="conEnvio"
                        render={({ field }) => (
                          <View style={[styles.mitad, !enCelular && styles.mitadAncha]}>
                            <Segmentado
                              opciones={OPCIONES_ENTREGA}
                              valor={field.value ? 'envio' : 'retiro'}
                              alCambiar={(valor) => field.onChange(valor === 'envio')}
                              accessibilityLabel="Cómo recibís el pedido"
                            />
                            {field.value && (
                              <Text variant="caption" color="textMuted">
                                La dirección la coordinamos por WhatsApp.
                              </Text>
                            )}
                          </View>
                        )}
                      />
                      <View style={[styles.mitad, !enCelular && styles.mitadAncha]}>
                        {navidad ? (
                          <BotonFiestas
                            label="Confirmar pedido"
                            onPress={pedido.confirmar}
                            loading={pedido.enviando}
                            disabled={!cotizacion || pedido.cotizando}
                          />
                        ) : (
                          <Button
                            label="Confirmar pedido"
                            onPress={pedido.confirmar}
                            loading={pedido.enviando}
                            disabled={!cotizacion || pedido.cotizando}
                            fullWidth
                          />
                        )}
                        <Text variant="caption" color="textMuted" align="center">
                          {TEXTO_ANTES_DE_CONFIRMAR}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      <HojaDiaLleno
        visible={pedido.diaLleno.visible}
        opciones={pedido.diaLleno.opciones}
        alElegir={pedido.diaLleno.elegir}
        alCerrar={pedido.diaLleno.cerrar}
      />
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Una sola columna, como en el celular, del mismo ancho que la carta: hasta 780 en la tableta, el 80% en la compu
    contenido: { gap: theme.spacing.lg, width: '100%', maxWidth: theme.sizes.cartaMax, alignSelf: 'center' },
    contenidoCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    volver: { alignItems: 'flex-start' },
    encabezado: { gap: theme.spacing.xs },
    adorno: { paddingTop: theme.spacing.sm },
    // Los pasos, uno debajo del otro
    cuerpo: { gap: theme.spacing.xxl },
    columnaCuentas: { gap: theme.spacing.xxl },
    paso: { gap: theme.spacing.md },
    // El selector de envío y «Confirmar pedido»: uno debajo del otro en el celular; mitad y mitad en pantallas anchas
    cierre: { gap: theme.spacing.lg },
    cierreAncho: { flexDirection: 'row', alignItems: 'flex-start' },
    mitad: { gap: theme.spacing.sm },
    mitadAncha: { flex: 1, minWidth: 0 },
    campo: { gap: theme.spacing.sm },
    cargando: { paddingVertical: theme.spacing.xl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
    separado: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    agregar: { alignItems: 'flex-start' },
  });
