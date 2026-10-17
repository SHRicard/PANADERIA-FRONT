import { StyleSheet, View } from 'react-native';
import { BotonCarrito } from '@/features/carrito';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

/** Arriba de la vidriera: la marca con el botón del carrito, y el título con la línea dorada */
export function CabeceraVidriera() {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.cabecera}>
      <View style={styles.marca}>
        <LogoDamaBlanca width={theme.sizes.iconoPestana} height={theme.sizes.iconoPestana} aria-hidden />
        <View style={styles.nombre}>
          <Text variant="title">Dama Blanca</Text>
          <Text variant="overline" color="textMuted">
            Horneados
          </Text>
        </View>
        <BotonCarrito />
      </View>
      <View style={styles.titulo}>
        <Text variant="display" accessibilityRole="header">
          Nuestros productos
        </Text>
        <Text color="textMuted">Todo lo que horneamos, con su precio. Tocá uno para ver sus fotos.</Text>
      </View>
      <Adorno forma="izquierda" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cabecera: { gap: theme.spacing.lg },
    marca: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    nombre: { flex: 1 },
    titulo: { gap: theme.spacing.xs },
  });
