import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { textoCantidadReceta, textoCosto } from '../textos';
import type { IngredienteReceta } from '../types';

interface IngredienteConCostoProps {
  ingrediente: IngredienteReceta;
  /** Al realizar la receta: la cantidad no daba justo y se redondeó para arriba (7,5 huevos → 8) */
  redondeado?: boolean;
}

/** Un ingrediente de la receta: qué es, cuánto lleva y lo que cuesta con el último precio del insumo */
export function IngredienteConCosto({ ingrediente, redondeado = false }: IngredienteConCostoProps) {
  const styles = useStyles(createStyles);
  const costo =
    ingrediente.insumo === null ? 'No se compra' : ingrediente.costo === null ? 'Sin costo' : textoCosto(ingrediente.costo);

  return (
    <View style={styles.fila}>
      <View style={styles.texto}>
        <Text variant="bodyStrong">{ingrediente.nombre}</Text>
        <Text variant="caption" color="textMuted">
          {textoCantidadReceta(ingrediente.cantidad, ingrediente.unidad)}
          {redondeado ? ' · redondeado para arriba' : ''}
        </Text>
      </View>
      <Text color={ingrediente.insumo === null ? 'textMuted' : 'text'} style={styles.cifra}>
        {costo}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    texto: { flex: 1, gap: theme.spacing.xxs },
    cifra: { fontVariant: ['tabular-nums'] },
  });
