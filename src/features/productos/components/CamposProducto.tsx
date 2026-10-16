import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, type Control, type UseFormSetFocus } from 'react-hook-form';
import { CampoTexto, Segmentado, Select, Text, type OpcionSegmentado, type OpcionSelect } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { ETIQUETA_MAX } from '../schemas';
import type { EstadoProducto, ProductoFormulario } from '../types';

const ESTADOS: OpcionSegmentado<EstadoProducto>[] = [
  { valor: 'activo', label: 'Activo' },
  { valor: 'pausado', label: 'Pausado' },
];

interface CamposProductoProps {
  control: Control<ProductoFormulario>;
  enfocar: UseFormSetFocus<ProductoFormulario>;
  /** Los gustos de la lista fija del back (useCategorias) */
  categorias: string[];
}

/** Los datos del producto: los mismos en el alta y en la edición */
export function CamposProducto({ control, enfocar, categorias }: CamposProductoProps) {
  const styles = useStyles(createStyles);
  const gustos = useMemo<OpcionSelect<string>[]>(
    () => categorias.map((categoria) => ({ valor: categoria, label: categoria })),
    [categorias],
  );
  const cargandoGustos = gustos.length === 0;

  return (
    <View style={styles.campos}>
      <CampoTexto
        control={control}
        name="nombre"
        label="Nombre"
        placeholder="Medialunas de manteca"
        autoCapitalize="sentences"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('etiqueta')}
      />
      <CampoTexto
        control={control}
        name="etiqueta"
        label="Etiqueta"
        placeholder="Promo lanzamiento"
        helper={`Se ve destacada en el catálogo. Hasta ${ETIQUETA_MAX} caracteres. Opcional.`}
        autoCapitalize="sentences"
        maxLength={ETIQUETA_MAX}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('precio')}
      />
      <CampoTexto
        control={control}
        name="precio"
        label="Precio"
        placeholder="4800"
        helper="En pesos, sin puntos."
        keyboardType="number-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('pesoGramos')}
      />

      <Controller
        control={control}
        name="disponible"
        render={({ field: { value, onChange } }) => (
          <View style={styles.campo}>
            <Text variant="label">Estado</Text>
            <Segmentado
              opciones={ESTADOS}
              valor={value ? 'activo' : 'pausado'}
              alCambiar={(estado) => onChange(estado === 'activo')}
              accessibilityLabel="Estado"
            />
            <Text variant="caption" color="textMuted">
              {value
                ? 'Se ve en el catálogo y se puede pedir.'
                : 'No se ve en el catálogo ni se puede pedir, pero guarda sus datos y fotos. Para productos de temporada, como el pan dulce.'}
            </Text>
          </View>
        )}
      />

      <Controller
        control={control}
        name="categoria"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Select
            label="Gusto"
            tituloHoja="¿De qué gusto es?"
            opciones={gustos}
            valor={value || null}
            alCambiar={onChange}
            placeholder={cargandoGustos ? 'Cargando gustos…' : 'Dulce, salado, picante…'}
            disabled={cargandoGustos}
            error={error?.message}
          />
        )}
      />

      <CampoTexto
        control={control}
        name="pesoGramos"
        label="Peso en gramos"
        placeholder="540"
        helper="Opcional."
        keyboardType="number-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('anticipacionHoras')}
      />
      <CampoTexto
        control={control}
        name="anticipacionHoras"
        label="Anticipación en horas"
        placeholder="24"
        helper="Con cuántas horas hay que encargarlo. 0 si se puede pedir en el momento."
        keyboardType="number-pad"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('ingredientes')}
      />
      <CampoTexto
        control={control}
        name="ingredientes"
        label="Ingredientes"
        placeholder="harina, manteca, azúcar"
        helper="Separados por coma. Opcional."
        autoCapitalize="none"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('descripcion')}
      />
      <CampoTexto
        control={control}
        name="descripcion"
        label="Descripción"
        placeholder="Masa hojaldrada con manteca, horneada todas las mañanas."
        helper="Opcional."
        autoCapitalize="sentences"
        multiline
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campos: { gap: theme.spacing.lg },
    campo: { gap: theme.spacing.sm },
  });
