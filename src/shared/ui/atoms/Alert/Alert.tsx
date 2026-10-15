import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react-native';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  message: string;
  title?: string;
  tone?: AlertTone;
}

// Cada tono lleva su ícono: el estado nunca se comunica solo con el color
const TONOS: Record<AlertTone, { icono: LucideIcon; fondo: ColorToken; color: ColorToken }> = {
  info: { icono: Info, fondo: 'primarySoft', color: 'primary' },
  success: { icono: CircleCheck, fondo: 'successSoft', color: 'success' },
  warning: { icono: TriangleAlert, fondo: 'warningSoft', color: 'warning' },
  danger: { icono: CircleAlert, fondo: 'dangerSoft', color: 'danger' },
};

function AlertComponent({ message, title, tone = 'info' }: AlertProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { icono, fondo, color } = TONOS[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.alerta, { backgroundColor: theme.colors[fondo] }]}
    >
      <Icon icon={icono} color={color} />
      <View style={styles.textos}>
        {title && <Text variant="bodyStrong">{title}</Text>}
        <Text variant={title ? 'label' : 'body'}>{message}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    alerta: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });

export const Alert = memo(AlertComponent);
