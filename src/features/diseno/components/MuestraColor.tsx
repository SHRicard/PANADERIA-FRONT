import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';

export function MuestraColor({ token }: { token: ColorToken }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const valor = theme.colors[token];

  return (
    <View style={styles.muestra} accessible accessibilityLabel={`${token}, ${valor}`}>
      <View style={[styles.color, { backgroundColor: valor }]} />
      <View style={styles.datos}>
        <Text variant="label" numberOfLines={1}>
          {token}
        </Text>
        <Text variant="caption" color="textMuted">
          {valor.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    muestra: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    },
    color: { height: theme.spacing.xxxl, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    datos: { padding: theme.spacing.sm, gap: theme.spacing.xxs },
  });
