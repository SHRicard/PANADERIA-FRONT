import { memo, useState, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useStyles, useTheme, type Theme } from '@/theme';
import { Icon } from '../Icon';

export interface InputProps extends Omit<TextInputProps, 'style' | 'editable' | 'placeholderTextColor'> {
  ref?: Ref<TextInput>;
  /** Ícono a la izquierda, adentro del campo */
  icon?: LucideIcon;
  /** Algo a la derecha, adentro del campo (por ejemplo, el botón de mostrar la contraseña) */
  accessoryRight?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
}

function InputComponent({
  ref,
  icon,
  accessoryRight,
  invalid = false,
  disabled = false,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View
      style={[
        styles.contenedor,
        enfocado && styles.enfocado,
        invalid && styles.invalido,
        disabled && styles.deshabilitado,
      ]}
    >
      {icon && <Icon icon={icon} color={invalid ? 'danger' : enfocado ? 'primary' : 'textMuted'} />}
      <TextInput
        ref={ref}
        editable={!disabled}
        placeholderTextColor={theme.colors.textMuted}
        selectionColor={theme.colors.primary}
        cursorColor={theme.colors.primary}
        accessibilityState={{ disabled }}
        onFocus={(e) => {
          setEnfocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setEnfocado(false);
          onBlur?.(e);
        }}
        style={styles.input}
        {...rest}
      />
      {accessoryRight}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenedor: {
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
    enfocado: { borderColor: theme.colors.primary },
    invalido: { borderColor: theme.colors.danger },
    deshabilitado: { backgroundColor: theme.colors.surfaceMuted, opacity: theme.opacity.disabled },
    input: {
      flex: 1,
      alignSelf: 'stretch',
      ...theme.text.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.none,
      // En la web, el borde del contenedor ya marca el foco: sin el recuadro del navegador
      outlineWidth: 0,
    },
  });

export const Input = memo(InputComponent);
