import { StyleSheet, View } from 'react-native';
import type { Control, UseFormSetFocus } from 'react-hook-form';
import { CampoTexto } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NOMBRE_INSUMO_MAX } from '../schemas';
import type { FormularioInsumo } from '../types';

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
          placeholder="Harina 0000 x 20 kg"
          helper="Con la marca o el tamaño, si importa. Cada compra nueva se carga sobre el mismo insumo."
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
        helper="En pesos, sin puntos."
        keyboardType="number-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('fecha')}
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

const createStyles = (theme: Theme) => StyleSheet.create({ campos: { gap: theme.spacing.md } });
