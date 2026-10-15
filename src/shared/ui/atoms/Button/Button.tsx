import { memo } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useStyles, useTheme } from '@/theme';
import { Icon } from '../Icon';
import { createStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

function ButtonComponent({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const bloqueado = disabled || loading;
  const colorContenido = variant === 'primary' ? 'onPrimary' : 'primary';

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
        pressed && !bloqueado && styles[`${variant}Pressed`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors[colorContenido]} />
      ) : (
        icon && <Icon icon={icon} size="md" color={colorContenido} />
      )}
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

export const Button = memo(ButtonComponent);
