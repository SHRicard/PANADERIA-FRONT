import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown, CircleAlert } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { HojaInferior, ListaOpcionesHoja, type OpcionHoja } from '../HojaInferior';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type OpcionSelect<T extends string> = OpcionHoja<T>;

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

/**
 * Elegir una entre varias en un formulario. Se ve como un Input; al tocarlo sube una HojaInferior con
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
  const styles = useStyles(createStyles);
  const [abierto, setAbierto] = useState(false);
  const elegida = opciones.find((opcion) => opcion.valor === valor);

  return (
    <View style={styles.campo}>
      <Text variant="label">{label}</Text>
      <Pressable
        onPress={() => setAbierto(true)}
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
        <Text color={elegida ? 'text' : 'textMuted'} numberOfLines={1} style={styles.texto}>
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

      <HojaInferior visible={abierto} alCerrar={() => setAbierto(false)} titulo={tituloHoja ?? label}>
        <ListaOpcionesHoja
          opciones={opciones}
          valor={valor}
          alElegir={(opcion) => {
            alCambiar(opcion);
            setAbierto(false);
          }}
          accessibilityLabel={label}
        />
      </HojaInferior>
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
    texto: { flex: 1, paddingHorizontal: theme.spacing.xs },
    mensaje: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    textoMensaje: { flex: 1 },
  });
