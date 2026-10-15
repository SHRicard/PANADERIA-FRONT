import { useState } from 'react';
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Image } from 'expo-image';
import { Croissant } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { Imagen } from '../types';

// Ancho / alto de cada foto en el detalle
const PROPORCION = 4 / 3;

interface CarruselFotosProps {
  imagenes: Imagen[];
  nombre: string;
}

/** Las fotos del producto en grande (la `url`, no la miniatura), de a una, deslizando de costado */
export function CarruselFotos({ imagenes, nombre }: CarruselFotosProps) {
  const styles = useStyles(createStyles);
  const [ancho, setAncho] = useState(0);
  const [actual, setActual] = useState(0);

  const alTerminarDeslizar = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (ancho > 0) setActual(Math.round(nativeEvent.contentOffset.x / ancho));
  };

  if (imagenes.length === 0) {
    return (
      <View style={[styles.marco, styles.vacio]} accessibilityLabel="Sin fotos">
        <Icon icon={Croissant} size="xl" color="textMuted" />
        <Text variant="caption" color="textMuted">
          Sin fotos todavía
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.marco} onLayout={({ nativeEvent }) => setAncho(nativeEvent.layout.width)}>
      {ancho > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={alTerminarDeslizar}>
          {imagenes.map((imagen, indice) => (
            <Image
              key={imagen.id}
              source={{ uri: imagen.url }}
              placeholder={{ uri: imagen.miniatura }}
              style={{ width: ancho, aspectRatio: PROPORCION }}
              contentFit="cover"
              transition={200}
              accessibilityLabel={`${nombre}, foto ${indice + 1} de ${imagenes.length}`}
            />
          ))}
        </ScrollView>
      )}
      {imagenes.length > 1 && (
        <View style={styles.contador} pointerEvents="none">
          <Text variant="caption">
            {actual + 1} / {imagenes.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    marco: {
      aspectRatio: PROPORCION,
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    vacio: { alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
    contador: {
      position: 'absolute',
      right: theme.spacing.sm,
      bottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
    },
  });
