import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { useStyles, type ColorToken } from '@/theme';
import { Cargando } from '../Cargando';
import { Icon } from '../Icon';
import { createStyles } from './Button.styles';
import type { ButtonProps, ButtonVariant } from './Button.types';

/** El color del ícono y de la vidriera de la carga: el mismo que el del texto */
const COLOR_CONTENIDO: Record<ButtonVariant, ColorToken> = {
  primary: 'onPrimary',
  secondary: 'primary',
  ghost: 'primary',
  danger: 'danger',
  success: 'onSuccess',
};

function ButtonComponent({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const styles = useStyles(createStyles);
  const bloqueado = disabled || loading;
  const colorContenido = COLOR_CONTENIDO[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: bloqueado, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        size === 'sm' && styles.sm,
        pressed && !bloqueado && styles[`${variant}Pressed`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <Cargando tamano="chico" color={colorContenido} />
      ) : (
        icon && <Icon icon={icon} size={size === 'sm' ? 'sm' : 'md'} color={colorContenido} />
      )}
      <Text style={[styles.label, size === 'sm' && styles.labelSm, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

export const Button = memo(ButtonComponent);
