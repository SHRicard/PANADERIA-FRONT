import { StyleSheet, View } from 'react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

interface AuthEncabezadoProps {
  titulo: string;
  descripcion: string;
}

export function AuthEncabezado({ titulo, descripcion }: AuthEncabezadoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      {/* El label va en el View: así se anuncia una sola vez en el celular y en la web */}
      <View accessible role="img" aria-label="Dama Blanca Horneados" style={styles.logo}>
        <LogoDamaBlanca width={theme.sizes.logo} height={theme.sizes.logo} aria-hidden />
      </View>
      <Text variant="heading" align="center">
        {titulo}
      </Text>
      <Text color="textMuted" align="center">
        {descripcion}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: { gap: theme.spacing.sm, alignItems: 'center' },
    logo: { marginBottom: theme.spacing.sm },
  });
