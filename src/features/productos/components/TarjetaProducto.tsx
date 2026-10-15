import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Croissant } from 'lucide-react-native';
import { Badge, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import type { FotoEnCola } from '../store/subidaFotosSlice';
import type { Producto } from '../types';
import { EstadoSubida } from './EstadoSubida';

interface TarjetaProductoProps {
  producto: Producto;
  /** Sus fotos que todavía no están en el servidor */
  enCola: FotoEnCola[];
  onPress: () => void;
  onReintentar: (ids: string[]) => void;
  onDescartar: (ids: string[]) => void;
}

const cantidadDeFotos = (cantidad: number) =>
  cantidad === 0 ? 'Sin fotos' : cantidad === 1 ? '1 foto' : `${cantidad} fotos`;

export function TarjetaProducto({ producto, enCola, onPress, onReintentar, onDescartar }: TarjetaProductoProps) {
  const styles = useStyles(createStyles);

  // Mientras la portada sube, se ve la foto local: el dueño no espera a que llegue la del servidor
  const portada = producto.imagenes[0]?.miniatura ?? enCola[0]?.uri;
  const detalle = [producto.categoria, producto.pesoGramos && `${producto.pesoGramos} g`].filter(Boolean).join(' · ');

  return (
    <View style={styles.tarjeta}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${producto.nombre}, ${formatearPrecio(producto.precio)}`}
        accessibilityHint="Ver el detalle"
        style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
      >
        <View style={styles.miniatura}>
          {portada ? (
            <Image source={{ uri: portada }} style={styles.imagen} contentFit="cover" transition={150} />
          ) : (
            <Icon icon={Croissant} size="lg" color="textMuted" />
          )}
        </View>

        <View style={styles.datos}>
          <View style={styles.titulo}>
            <Text variant="bodyStrong" numberOfLines={2} style={styles.nombre}>
              {producto.nombre}
            </Text>
            <Text variant="bodyStrong" style={styles.precio}>
              {formatearPrecio(producto.precio)}
            </Text>
          </View>
          {detalle ? (
            <Text variant="caption" color="textMuted">
              {detalle}
            </Text>
          ) : null}
          <View style={styles.etiquetas}>
            {!producto.disponible && <Badge tone="neutral" label="Pausado" />}
            <Text variant="caption" color="textMuted">
              {cantidadDeFotos(producto.imagenes.length)}
            </Text>
          </View>
        </View>

        <View style={styles.flecha}>
          <Icon icon={ChevronRight} color="textMuted" />
        </View>
      </Pressable>

      <EstadoSubida enCola={enCola} onReintentar={onReintentar} onDescartar={onDescartar} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    fila: { flexDirection: 'row', gap: theme.spacing.md },
    presionada: { opacity: theme.opacity.pressed },
    miniatura: {
      width: theme.sizes.miniatura,
      height: theme.sizes.miniatura,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceMuted,
    },
    imagen: { width: '100%', height: '100%' },
    datos: { flex: 1, gap: theme.spacing.xxs },
    titulo: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
    // Cifras de ancho fijo: los precios de la lista quedan parejos
    precio: { fontVariant: ['tabular-nums'] },
    nombre: { flex: 1 },
    etiquetas: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing.sm },
    flecha: { justifyContent: 'center' },
  });
