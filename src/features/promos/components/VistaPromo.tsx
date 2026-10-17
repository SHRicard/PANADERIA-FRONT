import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Play, Video } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { textoDuracion } from '../textos';
import type { TipoPromo } from '../types';

interface VistaPromoProps {
  tipo: TipoPromo;
  /**
   * La imagen: la miniatura del back (en los videos, el primer fotograma) o la foto recién elegida. null en un video que
   * todavía no se subió: el primer fotograma no está hasta que lo procesa Cloudinary
   */
  uri: string | null;
  duracionSegundos?: number;
  /** Lado del cuadrado (la lista). Sin lado, ocupa todo el ancho y muestra la imagen entera, sin recortar */
  lado?: number;
}

/** La foto o el video de una promo. En los videos, el ícono de play y cuánto dura («0:09»), como en la galería */
export function VistaPromo({ tipo, uri, duracionSegundos, lado }: VistaPromoProps) {
  const styles = useStyles(createStyles);
  const esVideo = tipo === 'video';
  const descripcion = esVideo
    ? duracionSegundos != null
      ? `Video de ${Math.round(duracionSegundos)} segundos`
      : 'Video'
    : 'Foto';

  return (
    <View
      style={[styles.marco, lado ? { width: lado, height: lado } : styles.todoElAncho]}
      accessible
      role="img"
      aria-label={descripcion}
    >
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit={lado ? 'cover' : 'contain'} transition={150} />
      ) : (
        <View style={styles.sinImagen}>
          <Icon icon={Video} size={lado ? 'lg' : 'xl'} color="textMuted" />
        </View>
      )}
      {esVideo && (
        <View style={[styles.duracion, lado ? styles.duracionChica : styles.duracionGrande]}>
          <Icon icon={Play} size="xs" relleno="lleno" />
          {duracionSegundos != null && <Text variant="caption">{textoDuracion(duracionSegundos)}</Text>}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { borderRadius: theme.radius.md, overflow: 'hidden', backgroundColor: theme.colors.surfaceMuted },
    todoElAncho: { width: '100%', aspectRatio: 1 },
    sinImagen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    duracion: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xxs,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surface,
    },
    // En la miniatura de la lista, pegada a la esquina para que entre en el cuadradito
    duracionChica: { left: theme.spacing.xxs, bottom: theme.spacing.xxs },
    duracionGrande: { left: theme.spacing.sm, bottom: theme.spacing.sm, paddingVertical: theme.spacing.xxs },
  });
