import { StyleSheet, View } from 'react-native';
import { Segmentado, Text, type OpcionSegmentado } from '@/shared/ui/atoms';
import { ESTILOS_TIPOGRAFIA, useStyles, useTipografia, type EstiloTipografia, type Theme } from '@/theme';

const OPCIONES: OpcionSegmentado<EstiloTipografia>[] = Object.values(ESTILOS_TIPOGRAFIA).map(({ estilo, nombre }) => ({
  valor: estilo,
  label: nombre,
}));

// Como la barra: el cambio se ve en el momento, en toda la app
export function PreferenciaTipografia() {
  const styles = useStyles(createStyles);
  const { estilo, cambiarEstilo } = useTipografia();

  return (
    <View style={styles.campo}>
      <Text variant="label">Tipografía</Text>
      <Segmentado opciones={OPCIONES} valor={estilo} alCambiar={cambiarEstilo} accessibilityLabel="Tipografía" />
      <Text variant="caption" color="textMuted">
        {ESTILOS_TIPOGRAFIA[estilo].descripcion}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
  });
