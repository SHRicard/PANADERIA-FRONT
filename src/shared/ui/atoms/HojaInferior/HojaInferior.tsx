import { useEffect, useRef, type ReactNode } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles, useTheme, type Theme } from '@/theme';
import { Text } from '../Text';

export interface HojaInferiorProps {
  visible: boolean;
  /** Tocar afuera, el botón de atrás de Android o lo que la cierre desde adentro */
  alCerrar: () => void;
  titulo: string;
  children: ReactNode;
  /** Queda fijo abajo, fuera de lo que se desliza (ej.: «Ver 8 productos») */
  pie?: ReactNode;
}

// La hoja sube; el velo de atrás aparece con el fundido del Modal
const ENTRADA = { duration: 260, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System };

/**
 * La hoja, que sube desde abajo lo que mide. Con transform y no con la animación de entrada de Reanimated
 * (SlideInDown): esa mueve la posición del layout y en Android se queda con el primer tamaño del Modal, que
 * no cuenta las barras del sistema; la hoja quedaba flotando lejos del borde
 */
function Hoja({ style, children }: { style: StyleProp<ViewStyle>; children: ReactNode }) {
  const medida = useRef(false);
  const alto = useSharedValue(0);
  const progreso = useSharedValue(0);
  const entrada = useAnimatedStyle(() => ({
    // Invisible hasta medirse: si no, se ve un cuadro en su lugar antes de que arranque
    opacity: alto.value > 0 ? 1 : 0,
    transform: [{ translateY: (1 - progreso.value) * alto.value }],
  }));

  return (
    <Animated.View
      style={[style, entrada]}
      onLayout={(e) => {
        if (medida.current) return;
        medida.current = true;
        alto.value = e.nativeEvent.layout.height;
        progreso.value = withTiming(1, ENTRADA);
      }}
    >
      {children}
    </Animated.View>
  );
}

/** Una hoja que sube desde abajo sobre un velo oscuro: para elegir algo (el Select) o filtrar una lista */
export function HojaInferior({ visible, alCerrar, titulo, children, pie }: HojaInferiorProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();

  // Si había un campo escribiendo, el teclado taparía la hoja
  useEffect(() => {
    if (visible) Keyboard.dismiss();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={alCerrar}
    >
      <View style={styles.velo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={alCerrar} accessibilityRole="button" accessibilityLabel="Cerrar" />
        <Hoja style={[styles.hoja, { paddingBottom: bottom + theme.spacing.lg }]}>
          <View style={styles.manija} />
          <Text variant="title" style={styles.titulo}>
            {titulo}
          </Text>
          <ScrollView style={styles.desliza} contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {pie}
        </Hoja>
      </View>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    velo: { flex: 1, justifyContent: 'flex-end', backgroundColor: theme.colors.overlay },
    hoja: {
      // En una pantalla ancha (la web en la compu) no cruza de lado a lado
      width: '100%',
      maxWidth: theme.sizes.formMax,
      alignSelf: 'center',
      maxHeight: theme.sizes.hojaMax,
      gap: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
    },
    manija: {
      alignSelf: 'center',
      width: theme.sizes.manijaAncho,
      height: theme.sizes.manijaAlto,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
    },
    titulo: { paddingHorizontal: theme.spacing.xs },
    // Sin crecer: la hoja mide lo que su contenido, hasta el tope; recién ahí se desliza
    desliza: { flexGrow: 0 },
    contenido: { gap: theme.spacing.md },
  });
