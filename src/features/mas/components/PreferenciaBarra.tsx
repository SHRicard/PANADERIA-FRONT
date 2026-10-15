import { StyleSheet, View } from 'react-native';
import { ESTILOS_BARRA, useEstiloBarra, type EstiloBarra } from '@/features/navegacion';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { ListaRadio, type OpcionRadio } from './ListaRadio';

const OPCIONES: OpcionRadio<EstiloBarra>[] = Object.values(ESTILOS_BARRA).map(({ estilo, nombre, descripcion }) => ({
  valor: estilo,
  nombre,
  descripcion,
}));

// Son seis: no entran en un Segmentado, así que van en lista. El cambio se ve en el momento, al volver a las pestañas
export function PreferenciaBarra() {
  const styles = useStyles(createStyles);
  const { estilo, cambiarEstilo } = useEstiloBarra();

  return (
    <View style={styles.campo}>
      <Text variant="label">Barra de pestañas</Text>
      <ListaRadio opciones={OPCIONES} valor={estilo} alCambiar={cambiarEstilo} accessibilityLabel="Barra de pestañas" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
  });
