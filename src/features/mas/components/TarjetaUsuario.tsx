import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface TarjetaUsuarioProps {
  /** El usuario con el que se entró. null si no se pudo leer */
  usuario: string | null;
}

/**
 * Con quién está abierta la sesión, arriba del menú. Radio más grande que las filas:
 * se lee como una cosa distinta a las opciones, aunque compartan fondo y borde
 */
export function TarjetaUsuario({ usuario }: TarjetaUsuarioProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.tarjeta}>
      {/* El usuario es un email: en la letra de título casi llenaba la tarjeta y uno largo se cortaba. Más chico y,
          si igual no entra, en dos renglones antes de cortarse con «…» */}
      <Text variant="bodyStrong" numberOfLines={2}>
        {usuario ?? 'Administrador'}
      </Text>
      <Text variant="caption" color="textMuted">
        Administrador de Dama Blanca
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.xxs,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
  });
