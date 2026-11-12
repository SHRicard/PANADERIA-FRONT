import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { ASSETS_NAVIDAD, type NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';

interface IlustracionProps {
  nombre: NombreAssetNavidad;
  /** El ancho o el alto (de los tokens de `sizes`): el otro sale de la proporción del dibujo */
  ancho?: DimensionValue;
  alto?: DimensionValue;
  /** Espejado (el acebo de la derecha de un título) */
  espejado?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Un dibujo de Navidad (assetsNavidad.ts), entero y sin deformar. Es decorativo: el lector de pantalla lo saltea y no
 * recibe toques. Nunca lleva texto adentro: lo que se lee va con <Text>
 */
export function Ilustracion({ nombre, ancho, alto, espejado = false, style }: IlustracionProps) {
  const { fuente, proporcion } = ASSETS_NAVIDAD[nombre];

  return (
    <View
      aria-hidden
      style={[styles.marco, { width: ancho, height: alto, aspectRatio: proporcion }, espejado && styles.espejado, style]}
    >
      <Image source={fuente} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
    </View>
  );
}

// Sin tokens: no tiene medidas propias
const styles = StyleSheet.create({
  marco: { pointerEvents: 'none' },
  espejado: { transform: [{ scaleX: -1 }] },
});
