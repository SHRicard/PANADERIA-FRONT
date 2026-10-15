import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

export interface OpcionRadio<T extends string> {
  valor: T;
  nombre: string;
  descripcion: string;
}

interface ListaRadioProps<T extends string> {
  opciones: readonly OpcionRadio<T>[];
  valor: T;
  alCambiar: (valor: T) => void;
  accessibilityLabel: string;
}

/** Elegir una entre muchas (más de las que entran en un Segmentado), cada una con lo que la distingue */
export function ListaRadio<T extends string>({ opciones, valor, alCambiar, accessibilityLabel }: ListaRadioProps<T>) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.lista} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {opciones.map(({ valor: opcion, nombre, descripcion }, indice) => {
        const elegida = opcion === valor;
        return (
          <Pressable
            key={opcion}
            onPress={() => alCambiar(opcion)}
            accessibilityRole="radio"
            accessibilityState={{ checked: elegida }}
            accessibilityLabel={nombre}
            accessibilityHint={descripcion}
            style={({ pressed }) => [
              styles.opcion,
              indice > 0 && styles.separada,
              elegida && styles.elegida,
              pressed && styles.presionada,
            ]}
          >
            <View style={[styles.radio, elegida && styles.radioElegido]}>{elegida && <View style={styles.punto} />}</View>
            <View style={styles.textos}>
              <Text variant="bodyStrong">{nombre}</Text>
              <Text variant="caption" color="textMuted">
                {descripcion}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    lista: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    opcion: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      minHeight: theme.sizes.touchMin,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    separada: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    elegida: { backgroundColor: theme.colors.primarySoft },
    presionada: { opacity: theme.opacity.pressed },
    textos: { flex: 1, gap: theme.spacing.xxs },
    radio: {
      width: theme.iconSize.md,
      height: theme.iconSize.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    radioElegido: { borderColor: theme.colors.primary },
    punto: {
      width: theme.spacing.sm + theme.spacing.xxs,
      height: theme.spacing.sm + theme.spacing.xxs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
    },
  });
