import { StyleSheet, View } from 'react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

/** Arriba de la página, como en la carta: el logo con «Dama Blanca» y «Horneados», que se sepa de quién es la web */
export function MarcaNoEncontrado() {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.barra} accessible accessibilityLabel="Dama Blanca, horneados">
      <LogoDamaBlanca width={theme.sizes.logoChico} height={theme.sizes.logoChico} aria-hidden />
      <View>
        <Text variant="title">Dama Blanca</Text>
        <Text variant="overline" color="textMuted">
          Horneados
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: theme.spacing.md },
  });
