import { useRef } from 'react';
import { Pressable, StyleSheet, type TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Icon, Input } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

interface BuscadorCatalogoProps {
  texto: string;
  alCambiar: (texto: string) => void;
  placeholder: string;
}

/**
 * El buscador por nombre de la carta y la vidriera. Con algo escrito, a la derecha va la X para borrarlo de un
 * toque; al borrar, el foco vuelve al campo para escribir otra cosa
 */
export function BuscadorCatalogo({ texto, alCambiar, placeholder }: BuscadorCatalogoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const campo = useRef<TextInput>(null);

  return (
    <Input
      ref={campo}
      icon={Search}
      value={texto}
      onChangeText={alCambiar}
      placeholder={placeholder}
      accessibilityLabel="Buscar por nombre"
      autoCorrect={false}
      returnKeyType="search"
      accessoryRight={
        texto ? (
          <Pressable
            onPress={() => {
              alCambiar('');
              campo.current?.focus();
            }}
            hitSlop={theme.spacing.xs}
            accessibilityRole="button"
            accessibilityLabel="Borrar la búsqueda"
            style={({ pressed }) => [styles.borrar, pressed && styles.presionado]}
          >
            <Icon icon={X} color="textMuted" />
          </Pressable>
        ) : null
      }
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Tocable de 44x44 sin agrandar el campo: se come el padding derecho del input
    borrar: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      marginRight: -theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    presionado: { opacity: theme.opacity.pressed },
  });
