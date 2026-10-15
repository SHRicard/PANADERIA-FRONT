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

    primary: { backgroundColor: theme.colors.primary },
    primaryPressed: { backgroundColor: theme.colors.primaryPressed },
    primaryLabel: { color: theme.colors.onPrimary },

    secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
    secondaryPressed: { backgroundColor: theme.colors.primarySoft },
    secondaryLabel: { color: theme.colors.primary },

    ghost: { backgroundColor: 'transparent', paddingHorizontal: theme.spacing.md },
    ghostPressed: { backgroundColor: theme.colors.primarySoft },
    ghostLabel: { color: theme.colors.primary },

    disabled: { opacity: theme.opacity.disabled },
  });
