import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { Text } from '../Text';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

// El texto va siempre en `text` (contraste alto); el tono lo marcan el fondo y el punto
const FONDO: Record<BadgeTone, ColorToken> = {
  neutral: 'surfaceMuted',
  primary: 'primarySoft',
  success: 'successSoft',
  warning: 'warningSoft',
  danger: 'dangerSoft',
};

const PUNTO: Record<BadgeTone, ColorToken> = {
  neutral: 'textMuted',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

function BadgeComponent({ label, tone = 'neutral' }: BadgeProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.badge, { backgroundColor: theme.colors[FONDO[tone]] }]}>
      <View style={[styles.punto, { backgroundColor: theme.colors[PUNTO[tone]] }]} />
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.full,
    },
    punto: { width: theme.spacing.sm, height: theme.spacing.sm, borderRadius: theme.radius.full },
    label: { fontWeight: theme.text.label.fontWeight },
  });

export const Badge = memo(BadgeComponent);
