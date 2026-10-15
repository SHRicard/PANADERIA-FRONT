import { useRef, useState, type ReactNode } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown, CircleAlert } from 'lucide-react-native';
import { useStyles, useTheme, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface OpcionSelect<T extends string> {
  valor: T;
  label: string;
}

export interface SelectProps<T extends string> {
  label: string;
  opciones: readonly OpcionSelect<T>[];
  /** La elegida; null = ninguna todavía (se ve el placeholder) */
  valor: T | null;
  alCambiar: (valor: T) => void;
  placeholder?: string;
  /** El título de la hoja que se abre. Por defecto, el label */
  tituloHoja?: string;
  /** Mensaje de error: pinta el campo en rojo y se muestra abajo, con ícono */
  error?: string;
  /** Ayuda que se muestra abajo cuando no hay error */
  helper?: string;
  /** Se ve pero no abre (por ejemplo, mientras llegan las opciones) */
  disabled?: boolean;
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

/**
 * Elegir una entre varias en un formulario. Se ve como un Input; al tocarlo sube una hoja desde abajo con
 * las opciones. Para pocas opciones (2 a 4) que conviene ver todas juntas, Segmentado
 */
export function Select<T extends string>({
  label,
  opciones,
  valor,
  alCambiar,
  placeholder,
  tituloHoja,
  error,
  helper,
  disabled = false,
}: SelectProps<T>) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();
  const [abierto, setAbierto] = useState(false);
  const elegida = opciones.find((opcion) => opcion.valor === valor);

  const abrir = () => {
    // Si había un campo escribiendo, el teclado taparía la hoja
    Keyboard.dismiss();
    setAbierto(true);
  };
  const cerrar = () => setAbierto(false);
  const elegir = (opcion: T) => {
    alCambiar(opcion);
    setAbierto(false);
  };

  return (
    <View style={styles.campo}>
      <Text variant="label">{label}</Text>
      <Pressable
        onPress={abrir}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityValue={{ text: elegida?.label ?? placeholder }}
        accessibilityHint={error ?? helper}
        accessibilityState={{ expanded: abierto, disabled }}
        style={({ pressed }) => [
          styles.caja,
          abierto && styles.abierta,
          !!error && styles.invalida,
          disabled && styles.deshabilitada,
          pressed && styles.presionada,
        ]}
      >
        <Text color={elegida ? 'text' : 'textMuted'} numberOfLines={1} style={styles.textoCaja}>
          {elegida?.label ?? placeholder}
        </Text>
        <Icon icon={ChevronDown} color={error ? 'danger' : abierto ? 'primary' : 'textMuted'} />
      </Pressable>
      {error ? (
        <View style={styles.mensaje} accessibilityLiveRegion="polite">
          <Icon icon={CircleAlert} size="sm" color="danger" />
          <Text variant="caption" color="danger" style={styles.textoMensaje}>
            {error}
          </Text>
        </View>
      ) : (
        helper && (
          <Text variant="caption" color="textMuted">
            {helper}
          </Text>
        )
      )}

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={cerrar}
      >
        <View style={styles.velo}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={cerrar}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
          />
          <Hoja style={[styles.hoja, { paddingBottom: bottom + theme.spacing.lg }]}>
            <View style={styles.manija} />
            <Text variant="title" style={styles.titulo}>
              {tituloHoja ?? label}
            </Text>
            <ScrollView
              style={styles.lista}
              contentContainerStyle={styles.opciones}
              showsVerticalScrollIndicator={false}
              accessibilityRole="radiogroup"
              accessibilityLabel={label}
            >
              {opciones.map((opcion) => {
                const activa = opcion.valor === valor;
                return (
                  <Pressable
                    key={opcion.valor}
                    onPress={() => elegir(opcion.valor)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: activa }}
                    accessibilityLabel={opcion.label}
                    style={({ pressed }) => [styles.opcion, activa && styles.activa, pressed && styles.presionada]}
                  >
                    <Text variant={activa ? 'bodyStrong' : 'body'} style={styles.valor}>
                      {opcion.label}
                    </Text>
                    {activa && <Icon icon={Check} color="primary" trazo="grueso" />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Hoja>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.xs },
    // El mismo cuerpo que el Input: en un formulario se lee como un campo más
    caja: {
      minHeight: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    abierta: { borderColor: theme.colors.primary },
    invalida: { borderColor: theme.colors.danger },
    deshabilitada: { backgroundColor: theme.colors.surfaceMuted, opacity: theme.opacity.disabled },
    presionada: { opacity: theme.opacity.pressed },
    // El TextInput de Android trae su propio aire a los costados: así el texto arranca donde el de un Input
    textoCaja: { flex: 1, paddingHorizontal: theme.spacing.xs },
    valor: { flex: 1 },
    mensaje: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    textoMensaje: { flex: 1 },

    velo: { flex: 1, justifyContent: 'flex-end', backgroundColor: theme.colors.overlay },
    hoja: {
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
    // Sin crecer: la hoja mide lo que sus opciones, hasta el tope; recién ahí se desliza
    lista: { flexGrow: 0 },
    opciones: { gap: theme.spacing.xs },
    opcion: {
      minHeight: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    activa: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  });
