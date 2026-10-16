import { StyleSheet, View } from 'react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';
import { BotonRedondo } from './BotonRedondo';

/** Centrado, como la carta de una pastelería: el logo arriba, el nombre de la panadería y un adorno bajo el título */
export function EncabezadoCarta({ titulo, accion }: EncabezadoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <LogoDamaBlanca width={theme.sizes.logoMedio} height={theme.sizes.logoMedio} aria-hidden />
      <Text variant="overline" color="textMuted" style={styles.marca}>
        Dama Blanca · Horneados
      </Text>
      <Text variant="display" align="center" numberOfLines={1}>
        {titulo}
      </Text>
      <View style={styles.adorno}>
        <Adorno forma="corto" />
      </View>

      {/* En la esquina, para no romper la simetría del centro */}
      {accion && (
        <View style={styles.accion}>
          <BotonRedondo accion={accion} variante="borde" />
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: { alignItems: 'center', gap: theme.spacing.xs, paddingBottom: theme.spacing.sm },
    marca: { marginTop: theme.spacing.xs },
    adorno: { marginTop: theme.spacing.xs },
    accion: { position: 'absolute', top: theme.spacing.none, right: theme.spacing.none },
  });
