import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface OpcionHoja<T extends string> {
  valor: T;
  label: string;
  /** Un dato corto a la derecha, en gris (ej.: cuántos productos tiene ese gusto) */
  detalle?: string;
}

export interface ListaOpcionesHojaProps<T extends string> {
  opciones: readonly OpcionHoja<T>[];
  valor: T | null;
  alElegir: (valor: T) => void;
  /** Qué se elige, para el lector de pantalla: "Gusto"… */
  accessibilityLabel: string;
}

/** Las opciones de una HojaInferior, una debajo de la otra. La elegida, resaltada y con tilde */
export function ListaOpcionesHoja<T extends string>({
  opciones,
  valor,
  alElegir,
  accessibilityLabel,
}: ListaOpcionesHojaProps<T>) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.lista} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {opciones.map((opcion) => {
        const elegida = opcion.valor === valor;
        return (
          <Pressable
            key={opcion.valor}
            onPress={() => alElegir(opcion.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: elegida }}
            accessibilityLabel={opcion.label}
            style={({ pressed }) => [styles.opcion, elegida && styles.elegida, pressed && styles.presionada]}
          >
            <Text variant={elegida ? 'bodyStrong' : 'body'} style={styles.texto}>
              {opcion.label}
            </Text>
            {opcion.detalle ? (
              <Text variant="caption" color="textMuted" style={styles.detalle}>
                {opcion.detalle}
              </Text>
            ) : null}
            {/* Siempre ocupa su lugar: así los números quedan alineados, tenga tilde o no */}
            <View style={!elegida && styles.oculto}>
              <Icon icon={Check} color="primary" trazo="grueso" />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    lista: { gap: theme.spacing.xs },
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
    elegida: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
    presionada: { opacity: theme.opacity.pressed },
    texto: { flex: 1 },
    detalle: { fontVariant: ['tabular-nums'] },
    oculto: { opacity: theme.opacity.none },
  });
