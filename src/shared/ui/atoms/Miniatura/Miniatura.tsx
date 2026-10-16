import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { useStyles, type Theme } from '@/theme';

export interface MiniaturaProps {
  /** La miniatura de la portada; null si el producto todavía no tiene fotos */
  uri: string | null;
  /** Cuántas fotos tiene: con más de una, lo dice en una esquina */
  cantidad?: number;
  /** Lado del cuadrado. Sin lado, ocupa todo el ancho que le den */
  lado?: number;
}

/** La foto de un producto, cuadrada (la portada). Sin foto, el logo de la panadería en suave */
export function Miniatura({ uri, cantidad = 0, lado }: MiniaturaProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.marco, lado ? { width: lado, height: lado } : styles.todoElAncho]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      ) : (
        <View style={styles.sinFoto}>
          <LogoDamaBlanca width="50%" height="50%" aria-hidden />
        </View>
      )}
      {cantidad > 1 && (
        <View style={styles.cantidad} accessibilityLabel={`${cantidad} fotos`}>
          <Icon icon={Camera} size="sm" />
          <Text variant="caption">{cantidad}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: { borderRadius: theme.radius.lg, overflow: 'hidden', backgroundColor: theme.colors.surfaceMuted },
    todoElAncho: { width: '100%', aspectRatio: 1 },
    sinFoto: {
      position: 'absolute',
      top: theme.spacing.none,
      right: theme.spacing.none,
      bottom: theme.spacing.none,
      left: theme.spacing.none,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primarySoft,
      opacity: theme.opacity.disabled,
    },
    cantidad: {
      position: 'absolute',
      left: theme.spacing.sm,
      bottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surface,
    },
  });
