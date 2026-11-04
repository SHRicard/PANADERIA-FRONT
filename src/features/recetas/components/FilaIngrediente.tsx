import { StyleSheet, View } from 'react-native';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { Trash2 } from 'lucide-react-native';
import { Button, CampoTexto, Segmentado, Select, type OpcionSegmentado, type OpcionSelect } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NO_SE_COMPRA, NOMBRE_INGREDIENTE_MAX } from '../schemas';
import { textoCantidadReceta } from '../textos';
import type { FormularioReceta, UnidadReceta } from '../types';

const UNIDADES: OpcionSegmentado<UnidadReceta>[] = [
  { valor: 'g', label: 'Gramos' },
  { valor: 'unidad', label: 'Unidades' },
];

interface FilaIngredienteProps {
  control: Control<FormularioReceta>;
  indice: number;
  /** Los insumos que se pueden elegir, más «Algo que no se compra» */
  opciones: readonly OpcionSelect<string>[];
  unidadDeInsumo: (id: string) => UnidadReceta | undefined;
  alQuitar: () => void;
  /** La receta necesita al menos uno: el único no se quita */
  puedeQuitar: boolean;
}

/** Un ingrediente del formulario: qué insumo es (o qué es, si no se compra) y cuánto lleva */
export function FilaIngrediente({ control, indice, opciones, unidadDeInsumo, alQuitar, puedeQuitar }: FilaIngredienteProps) {
  const styles = useStyles(createStyles);
  const eleccion = useWatch({ control, name: `ingredientes.${indice}.eleccion` });
  const unidadElegida = useWatch({ control, name: `ingredientes.${indice}.unidad` });
  const cantidad = useWatch({ control, name: `ingredientes.${indice}.cantidad` });
  const noSeCompra = eleccion === NO_SE_COMPRA;
  // La de un insumo sale del insumo; la de algo que no se compra, la elige el dueño
  const unidad = noSeCompra ? unidadElegida : (unidadDeInsumo(eleccion) ?? 'g');
  const numero = /^\d+$/.test(cantidad.trim()) && Number(cantidad) > 0 ? Number(cantidad) : null;

  return (
    <View style={styles.fila}>
      <Controller
        control={control}
        name={`ingredientes.${indice}.eleccion`}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Select
            label={`Ingrediente ${indice + 1}`}
            opciones={opciones}
            valor={value || null}
            alCambiar={onChange}
            placeholder="Elegí un insumo"
            tituloHoja="¿Qué lleva?"
            error={error?.message}
          />
        )}
      />
      {noSeCompra && (
        <>
          <CampoTexto
            control={control}
            name={`ingredientes.${indice}.nombre`}
            label="¿Qué es?"
            placeholder="Agua"
            helper="No se compra: cuesta $ 0, pero queda en la receta."
            autoCapitalize="sentences"
            maxLength={NOMBRE_INGREDIENTE_MAX}
          />
          <Controller
            control={control}
            name={`ingredientes.${indice}.unidad`}
            render={({ field: { value, onChange } }) => (
              <Segmentado opciones={UNIDADES} valor={value} alCambiar={onChange} accessibilityLabel="En qué se mide" />
            )}
          />
        </>
      )}
      <CampoTexto
        control={control}
        name={`ingredientes.${indice}.cantidad`}
        label={unidad === 'g' ? '¿Cuántos gramos lleva?' : '¿Cuántas unidades lleva?'}
        placeholder={unidad === 'g' ? '1000' : '2'}
        // Mientras escribe, cómo se lee: 1500 → «1 kilo y medio»
        helper={numero ? textoCantidadReceta(numero, unidad) : unidad === 'g' ? 'En gramos: 1000 es 1 kilo.' : 'Enteras.'}
        keyboardType="number-pad"
      />
      {puedeQuitar && (
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          label="Quitar"
          onPress={alQuitar}
          accessibilityLabel={`Quitar el ingrediente ${indice + 1}`}
        />
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: {
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      alignItems: 'stretch',
    },
  });
