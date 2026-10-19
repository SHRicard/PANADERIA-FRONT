import { StyleSheet, View } from 'react-native';
import { Controller, type Control, type UseFormSetFocus } from 'react-hook-form';
import { CampoTexto, Segmentado, Text, type OpcionSegmentado } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NOMBRE_INSUMO_MAX, UNIDADES_INSUMO } from '../schemas';
import { TEXTO_UNIDAD } from '../textos';
import type { FormularioInsumo, UnidadInsumo } from '../types';

const UNIDADES: OpcionSegmentado<UnidadInsumo>[] = UNIDADES_INSUMO.map((valor) => ({ valor, label: TEXTO_UNIDAD[valor] }));

interface CamposInsumoProps {
  control: Control<FormularioInsumo>;
  enfocar: UseFormSetFocus<FormularioInsumo>;
  /** En una compra nueva el nombre no se edita */
  pideNombre: boolean;
  alTerminar: () => void;
}

/** Los campos del alta, de una compra nueva y de una corrección */
export function CamposInsumo({ control, enfocar, pideNombre, alTerminar }: CamposInsumoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.campos}>
      {pideNombre && (
        <CampoTexto
          control={control}
          name="nombre"
          label="Nombre"
          placeholder="Harina 0000"
          helper="Con la marca, si importa. El tamaño va abajo, en cuánto vino: así se compara el precio por kilo aunque cambie la bolsa."
          autoCapitalize="sentences"
          maxLength={NOMBRE_INSUMO_MAX}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => enfocar('precio')}
        />
      )}
      <CampoTexto
        control={control}
        name="precio"
        label="¿Cuánto pagaste?"
        placeholder="54000"
        helper="Por todo lo que vino, en pesos, sin puntos."
        keyboardType="number-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('cantidad')}
      />
      <CampoTexto
        control={control}
        name="cantidad"
        label="¿Cuánto vino?"
        placeholder="25"
        helper="Con coma si hace falta: 0,5."
        keyboardType="decimal-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('fecha')}
      />
      <Controller
        control={control}
        name="unidad"
        render={({ field: { value, onChange } }) => (
          <View style={styles.campo}>
            <Text variant="label">¿En qué se mide?</Text>
            <Segmentado opciones={UNIDADES} valor={value} alCambiar={onChange} accessibilityLabel="En qué se mide" />
          </View>
        )}
      />
      <CampoTexto
        control={control}
        name="fecha"
        label="Fecha de la compra"
        placeholder="15/10/2026"
        helper="Día/mes/año."
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
        onSubmitEditing={alTerminar}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campos: { gap: theme.spacing.md },
    campo: { gap: theme.spacing.sm },
  });
