import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { BarraCarrito, useCarrito } from '@/features/carrito';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { Adorno, Alert, Button, CarruselFotos, ControlCantidad, ScreenContainer, Sello, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar, textoAnticipacion } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { PieCatalogo } from '../components/AvisosCatalogo';
import { Estrellas } from '../components/Estrellas';
import { FormularioRecomendacion } from '../components/FormularioRecomendacion';
import { ListaRecomendaciones } from '../components/ListaRecomendaciones';
import { useProductoCatalogo } from '../hooks/useProductoCatalogo';
import { useRecomendar } from '../hooks/useRecomendar';
import { textoIngredientes, textoPeso, textoPromedio, textoVotos } from '../textos';

/**
 * El detalle de un producto, con todas sus fotos. Tiene URL propia (/producto/:id): es lo que se comparte.
 * En la tableta y la compu, las fotos a la izquierda y los datos a la derecha. Abajo, las recomendaciones:
 * votar y lo que dijeron los demás (en la compu, una al lado de la otra)
 */
export function ProductoCatalogoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useProductoCatalogo(id);
  const refresco = useRefrescar(detalle.refrescar);
  const tamano = useBreakpoint();
  const enCelular = tamano === 'celular';
  const carrito = useCarrito();
  const recomendar = useRecomendar(id);
  const { producto } = detalle;
  const enPedido = producto ? carrito.cantidadDe(producto._id) : 0;
  // Con 0 se pide en el momento: no se muestra nada
  const anticipacion = producto ? textoAnticipacion(producto.anticipacionHoras) : null;

  return (
    <ScreenContainer width="completo" refreshControl={refresco.control} pie={<BarraCarrito />}>
      <View style={[styles.contenido, tamano === 'compu' && styles.contenidoCompu]}>
        <View style={styles.volver}>
          <Button variant="ghost" size="sm" icon={ArrowLeft} label="Catálogo" onPress={detalle.volver} accessibilityLabel="Volver al catálogo" />
        </View>

        {detalle.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

        {detalle.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={detalle.error} />
            <Button variant="secondary" label="Reintentar" onPress={detalle.reintentar} />
          </View>
        )}

        {/* El link de WhatsApp puede ser viejo: el producto se pausó o se borró */}
        {detalle.noDisponible && (
          <View style={styles.noDisponible}>
            <LogoDamaBlanca width={theme.sizes.foto} height={theme.sizes.foto} aria-hidden />
            <Text variant="heading" align="center">
              Este producto no está disponible
            </Text>
            <Text color="textMuted" align="center">
              Puede que se haya terminado o que el link sea viejo. Mirá todo lo que tenemos hoy.
            </Text>
            <Button label="Ver el catálogo" onPress={() => router.replace('/')} />
          </View>
        )}

        {producto && (
          <View style={[styles.producto, !enCelular && styles.productoAncho]}>
            <View style={!enCelular && styles.fotosAncho}>
              <CarruselFotos fotos={producto.imagenes} nombre={nombreParaMostrar(producto.nombre)} proporcion={1} miniaturas />
              {/* La etiqueta del dueño sobre la foto grande, arriba a la izquierda, como en la vidriera */}
              {producto.etiqueta ? (
                <View style={styles.sello} pointerEvents="none">
                  <Sello texto={producto.etiqueta} />
                </View>
              ) : null}
            </View>
            <View style={[styles.datos, !enCelular && styles.datosAncho]}>
              <Text variant="overline" color="textMuted">
                {producto.categoria}
              </Text>
              <Text variant="display" accessibilityRole="header">
                {nombreParaMostrar(producto.nombre)}
              </Text>
              {producto.puntajePromedio !== null && (
                <View style={styles.puntaje}>
                  <Estrellas puntaje={producto.puntajePromedio} />
                  <Text variant="label">{textoPromedio(producto.puntajePromedio)}</Text>
                  <Text variant="caption" color="textMuted">
                    {textoVotos(producto.cantidadRecomendaciones)}
                  </Text>
                </View>
              )}
              <View style={styles.precioFila}>
                <Text variant="title" color="primary" style={styles.precio}>
                  {formatearPrecio(producto.precio)}
                </Text>
                {producto.pesoGramos ? (
                  <Text variant="caption" color="textMuted">
                    {textoPeso(producto.pesoGramos)}
                  </Text>
                ) : null}
              </View>
              {anticipacion ? <Text variant="label">{anticipacion}</Text> : null}
              {producto.descripcion ? <Text>{producto.descripcion}</Text> : null}
              <View style={styles.agregar}>
                {enPedido === 0 ? (
                  <Button label="Agregar al pedido" icon={Plus} onPress={() => carrito.cambiarCantidad(producto._id, 1)} />
                ) : (
                  <View style={styles.enPedido}>
                    <ControlCantidad
                      valor={enPedido}
                      alCambiar={(cantidad) => carrito.cambiarCantidad(producto._id, cantidad)}
                      max={carrito.maxUnidades}
                      nombre={nombreParaMostrar(producto.nombre)}
                    />
                    <Text variant="label" color="textMuted">
                      En tu pedido
                    </Text>
                  </View>
                )}
              </View>
              {producto.ingredientes.length > 0 && (
                <View style={styles.ingredientes}>
                  <Adorno forma="izquierda" />
                  <Text variant="label">Ingredientes</Text>
                  <Text color="textMuted">{textoIngredientes(producto.ingredientes)}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {producto && (
          <View style={styles.recomendaciones}>
            <Adorno forma="izquierda" />
            <View style={[styles.opiniones, tamano === 'compu' && styles.opinionesCompu]}>
              <View style={tamano === 'compu' && styles.votar}>
                <FormularioRecomendacion
                  form={recomendar.form}
                  enviar={recomendar.enviar}
                  enviando={recomendar.enviando}
                  error={recomendar.error}
                  enviada={recomendar.enviada}
                />
              </View>
              <View style={tamano === 'compu' && styles.leer}>
                <ListaRecomendaciones
                  recomendaciones={producto.recomendaciones ?? []}
                  promedio={producto.puntajePromedio}
                  cantidad={producto.cantidadRecomendaciones}
                />
              </View>
            </View>
          </View>
        )}

        <PieCatalogo />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // El mismo ancho que la carta: una columna de hasta 780 en la tableta, el 80% de la ventana en la compu
    contenido: { gap: theme.spacing.lg, width: '100%', maxWidth: theme.sizes.cartaMax, alignSelf: 'center' },
    contenidoCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    volver: { alignItems: 'flex-start' },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    noDisponible: { alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.xxl },
    producto: { gap: theme.spacing.xl },
    productoAncho: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xxl },
    // Las fotos crecen hasta un tope (en una pantalla grande tapaban todo); lo que sobra es para los datos
    fotosAncho: { flex: 1, minWidth: 0, maxWidth: theme.sizes.galeriaMax },
    datos: { gap: theme.spacing.sm },
    datosAncho: { flex: 1, minWidth: 0 },
    sello: { position: 'absolute', top: theme.spacing.md, left: theme.spacing.md, right: theme.spacing.xxxl },
    puntaje: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    precioFila: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
    // El precio con la letra de texto en negrita (la de título es para nombres), en cifras parejas
    precio: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    ingredientes: { gap: theme.spacing.xs, paddingTop: theme.spacing.md },
    agregar: { alignItems: 'flex-start', paddingTop: theme.spacing.sm },
    enPedido: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    recomendaciones: { gap: theme.spacing.xl, paddingTop: theme.spacing.lg },
    opiniones: { gap: theme.spacing.xxl },
    opinionesCompu: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xxxl },
    votar: { flex: 2, minWidth: 0 },
    leer: { flex: 3, minWidth: 0 },
  });
