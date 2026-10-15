import { StyleSheet, View } from 'react-native';
import { ESTILOS_ENCABEZADO, useEstiloEncabezado, type EstiloEncabezado } from '@/features/navegacion';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { ListaRadio, type OpcionRadio } from './ListaRadio';

const OPCIONES: OpcionRadio<EstiloEncabezado>[] = Object.values(ESTILOS_ENCABEZADO).map(
  ({ estilo, nombre, descripcion }) => ({ valor: estilo, nombre, descripcion })
);

// El cambio se ve en el momento, al volver a las pestañas
export function PreferenciaEncabezado() {
  const styles = useStyles(createStyles);
  const { estilo, cambiarEstilo } = useEstiloEncabezado();

  return (
    <View style={styles.campo}>
      <Text variant="label">Encabezado de las pestañas</Text>
      <ListaRadio
        opciones={OPCIONES}
        valor={estilo}
        alCambiar={cambiarEstilo}
        accessibilityLabel="Encabezado de las pestañas"
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
  });
