import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Pause, Pencil, Play, Trash2 } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Badge, Button, CarruselFotos, ScreenContainer, Sello, Text } from '@/shared/ui/atoms';
import { formatearPrecio, textoAnticipacion } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { EstadoSubida } from '../components/EstadoSubida';
import { useProducto } from '../hooks/useProducto';

export function DetalleProductoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useProducto(id);
  const refresco = useRefrescar(detalle.refrescar);
  const { producto } = detalle;

  if (!producto) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
        <View style={styles.contenido}>
          {detalle.cargando && !refresco.refrescando ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
          ) : detalle.error ? (
            <View style={styles.bloque}>
              <Alert tone="danger" message={detalle.error} />
              <Button variant="secondary" label="Reintentar" onPress={detalle.reintentar} />
            </View>
          ) : (
            <View style={styles.bloque}>
              <Text variant="subtitle">Este producto ya no existe</Text>
              <Text color="textMuted">Puede que lo hayan eliminado.</Text>
              <Button variant="secondary" icon={ArrowLeft} label="Volver a productos" onPress={detalle.volver} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  // El dueño ve también el 0, que en la web no se muestra
  const datos = [
    producto.tipo?.nombre,
    producto.categoria,
    producto.pesoGramos && `${producto.pesoGramos} g`,
    textoAnticipacion(producto.anticipacionHoras) ?? 'Se pide en el momento',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <CarruselFotos fotos={producto.imagenes} nombre={producto.nombre} />
        {/* La etiqueta que se ve en el catálogo, justo debajo de las fotos */}
        {producto.etiqueta ? <Sello texto={producto.etiqueta} recto /> : null}
        <EstadoSubida
          enCola={detalle.enCola}
          onReintentar={detalle.reintentarFotos}
          onDescartar={detalle.descartarFotos}
        />

        <View style={styles.bloque}>
          <Badge tone={producto.disponible ? 'success' : 'neutral'} label={producto.disponible ? 'Activo' : 'Pausado'} />
          <Text variant="title">{producto.nombre}</Text>
          <Text variant="subtitle" color="primary" style={styles.precio}>
            {formatearPrecio(producto.precio)}
          </Text>
          {datos ? <Text color="textMuted">{datos}</Text> : null}
        </View>

        {producto.descripcion ? <Text>{producto.descripcion}</Text> : null}

        {producto.ingredientes.length > 0 && (
          <View style={styles.seccion}>
            <Text variant="label">Ingredientes</Text>
            <Text color="textMuted">{producto.ingredientes.join(', ')}</Text>
          </View>
        )}

        {detalle.errorEstado && <Alert tone="danger" message={detalle.errorEstado} />}
        {detalle.errorEliminar && <Alert tone="danger" message={detalle.errorEliminar} />}

        <View style={styles.acciones}>
          <Button icon={Pencil} label="Editar" onPress={detalle.editar} fullWidth />
          <Button
            variant="secondary"
            icon={producto.disponible ? Pause : Play}
            label={producto.disponible ? 'Pausar' : 'Activar'}
            onPress={detalle.alternarEstado}
            loading={detalle.cambiandoEstado}
            fullWidth
          />
          {!producto.disponible && (
            <Text variant="caption" color="textMuted" align="center">
              Pausado: no se ve en el catálogo ni se puede pedir.
            </Text>
          )}
          <Button
            variant="danger"
            icon={Trash2}
            label="Eliminar producto"
            onPress={detalle.eliminar}
            loading={detalle.eliminando}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    precio: { fontVariant: ['tabular-nums'] },
    seccion: { gap: theme.spacing.xxs },
    acciones: { gap: theme.spacing.sm },
  });
