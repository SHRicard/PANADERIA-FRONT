import { StyleSheet, View } from 'react-native';
import { Alert, SelectorTema, Text } from '@/shared/ui/atoms';
import { useStyles, type PreferenciaTema as Preferencia, type Theme } from '@/theme';
import { usePreferenciaTema } from '../hooks/usePreferenciaTema';

const DESCRIPCIONES: Record<Preferencia, string> = {
  claro: 'Claro en tu app y en la web: todos tus clientes lo ven así.',
  oscuro: 'Oscuro en tu app y en la web: todos tus clientes lo ven así.',
};

// Como las otras preferencias: el cambio se ve en el momento y se guarda solo (en el back, porque lo ve la web)
export function PreferenciaTema() {
  const styles = useStyles(createStyles);
  const tema = usePreferenciaTema();

  return (
    <View style={styles.campo}>
      <Text variant="label">Tema</Text>
      <SelectorTema valor={tema.preferencia} alCambiar={tema.elegir} />
      <Text variant="caption" color="textMuted">
        {DESCRIPCIONES[tema.preferencia]}
      </Text>
      {tema.error && <Alert tone="danger" message={tema.error} />}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
  });
