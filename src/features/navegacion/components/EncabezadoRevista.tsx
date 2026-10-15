import { StyleSheet, View } from 'react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Button, Text } from '@/shared/ui/atoms';
import { formatearFecha } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';

/** Alineado a la izquierda, como una revista: el logo con la fecha de hoy, el título grande y la acción en una píldora */
export function EncabezadoRevista({ titulo, accion }: EncabezadoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <View style={styles.marca}>
        <LogoDamaBlanca width={theme.sizes.logoMini} height={theme.sizes.logoMini} aria-hidden />
        <Text variant="overline" color="textMuted">
          {formatearFecha(new Date())}
        </Text>
      </View>

      <View style={styles.fila}>
        <Text variant="display" numberOfLines={1} style={styles.titulo}>
          {titulo}
        </Text>
        {accion && (
          <Button
            size="sm"
            icon={accion.icon}
            label={accion.label}
            onPress={accion.onPress}
            accessibilityLabel={accion.accessibilityLabel}
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // La línea fina de abajo lo separa del contenido
    encabezado: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    marca: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    titulo: { flex: 1 },
  });
