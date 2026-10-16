import { StyleSheet, View } from 'react-native';
import type { NativeStackHeaderProps } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { BotonRedondo } from './BotonRedondo';

/**
 * El encabezado de las pantallas que se abren encima de las pestañas (un producto, Preferencias…):
 * el botón redondo para volver, el título y abajo la línea dorada que se desvanece, como en las pestañas.
 * Reemplaza al de fábrica del Stack, que no sigue el diseño de la app
 */
export function EncabezadoPantalla({ options, back, navigation }: NativeStackHeaderProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { top } = useSafeAreaInsets();
  const titulo = typeof options.title === 'string' ? options.title : '';

  return (
    // Por debajo de la barra de estado también: el fondo crema llega hasta arriba
    <View style={[styles.encabezado, { paddingTop: top + theme.spacing.sm }]}>
      <View style={styles.fila}>
        {back && (
          <BotonRedondo accion={{ label: 'Volver', icon: ArrowLeft, onPress: navigation.goBack }} variante="borde" />
        )}
        <Text variant="title" numberOfLines={1} style={styles.titulo}>
          {titulo}
        </Text>
      </View>
      <Adorno forma="izquierda" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: {
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    titulo: { flex: 1 },
  });
