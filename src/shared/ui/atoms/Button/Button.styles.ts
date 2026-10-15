import { StyleSheet } from 'react-native';
import type { Theme } from '@/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: theme.sizes.control,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    fullWidth: { alignSelf: 'stretch' },
    label: theme.text.bodyStrong,

    sm: {
      minHeight: theme.sizes.touchMin,
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },
    labelSm: { ...theme.text.label, fontFamily: theme.fonts.textoNegrita },

    primary: { backgroundColor: theme.colors.primary },
    primaryPressed: { backgroundColor: theme.colors.primaryPressed },
    primaryLabel: { color: theme.colors.onPrimary },

    secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
    secondaryPressed: { backgroundColor: theme.colors.primarySoft },
    secondaryLabel: { color: theme.colors.primary },

    ghost: { backgroundColor: 'transparent', paddingHorizontal: theme.spacing.md },
    ghostPressed: { backgroundColor: theme.colors.primarySoft },
    ghostLabel: { color: theme.colors.primary },

    danger: { backgroundColor: theme.colors.surface, borderColor: theme.colors.danger },
    dangerPressed: { backgroundColor: theme.colors.dangerSoft },
    dangerLabel: { color: theme.colors.danger },

    disabled: { opacity: theme.opacity.disabled },
  });
