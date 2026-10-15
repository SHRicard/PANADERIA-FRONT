import { memo } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme, type ColorToken, type TextVariant } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
}

const VARIANTES_TITULO: TextVariant[] = ['display', 'heading', 'title'];

function TextComponent({ variant = 'body', color = 'text', align, style, accessibilityRole, ...rest }: TextProps) {
  const theme = useTheme();

  return (
    <RNText
      accessibilityRole={accessibilityRole ?? (VARIANTES_TITULO.includes(variant) ? 'header' : undefined)}
      style={[theme.text[variant], { color: theme.colors[color], textAlign: align }, style]}
      {...rest}
    />
  );
}

export const Text = memo(TextComponent);
