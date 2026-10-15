import { StyleSheet, View } from 'react-native';
import { SelectorTema, Text } from '@/shared/ui/atoms';
import { useStyles, useThemeMode, type PreferenciaTema as Preferencia, type Theme } from '@/theme';

const DESCRIPCIONES: Record<Preferencia, string> = {
  sistema: 'Sigue al celular: claro u oscuro según cómo lo tengas configurado.',
  claro: 'Siempre claro, aunque el celular esté en modo oscuro.',
  oscuro: 'Siempre oscuro: más cómodo de noche y en la cocina con poca luz.',
};

// Como las otras preferencias: el cambio se ve en el momento y se guarda solo
export function PreferenciaTema() {
  const styles = useStyles(createStyles);
  const { preferencia, cambiarPreferencia } = useThemeMode();

  return (
    <View style={styles.campo}>
      <Text variant="label">Tema</Text>
      <SelectorTema valor={preferencia} alCambiar={cambiarPreferencia} />
      <Text variant="caption" color="textMuted">
        {DESCRIPCIONES[preferencia]}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
  });
