import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface ChipsCategoriasProps {
  categorias: string[];
  /** El elegido; null = ninguno (o "Todos", si está) */
  valor: string | null;
  alCambiar: (categoria: string | null) => void;
  /** Suma un chip "Todos" al principio: para filtrar */
  conTodos?: boolean;
  accessibilityLabel: string;
}

/**
 * Filtrar por gusto (la categoría) de la lista fija del back, en una fila que se desliza. Se comporta como un
 * grupo de radios. En el formulario el gusto se elige con un Select
 */
export function ChipsCategorias({ categorias, valor, alCambiar, conTodos = false, accessibilityLabel }: ChipsCategoriasProps) {
  const styles = useStyles(createStyles);
  const opciones: { clave: string; label: string; valor: string | null }[] = [
    ...(conTodos ? [{ clave: '__todos', label: 'Todos', valor: null }] : []),
    ...categorias.map((categoria) => ({ clave: categoria, label: categoria, valor: categoria })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.fila}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor;
        return (
          <Pressable
            key={opcion.clave}
            onPress={() => alCambiar(opcion.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa }}
            accessibilityLabel={opcion.label}
            style={({ pressed }) => [styles.chip, activa && styles.activa, pressed && styles.presionada]}
          >
            <Text variant="label" color={activa ? 'onPrimary' : 'text'} numberOfLines={1}>
              {opcion.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { gap: theme.spacing.sm },
    chip: {
      minHeight: theme.sizes.touchMin,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    activa: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    presionada: { opacity: theme.opacity.pressed },
  });
