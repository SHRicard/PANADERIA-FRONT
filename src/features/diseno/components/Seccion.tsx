import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface SeccionProps {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}

export function Seccion({ titulo, descripcion, children }: SeccionProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.seccion}>
      <View style={styles.encabezado}>
        <Text variant="title">{titulo}</Text>
        {descripcion && <Text color="textMuted">{descripcion}</Text>}
      </View>
      {children}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: {
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    encabezado: { gap: theme.spacing.xxs },
  });
