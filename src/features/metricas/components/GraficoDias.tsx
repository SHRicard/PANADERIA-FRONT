import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { DIA_CORTO, textoPedidos } from '../textos';
import type { ResumenPedidos } from '../types';

interface GraficoDiasProps {
  dias: ResumenPedidos['porDiaDeLaSemana'];
}

/** Cuántos pedidos se hicieron cada día de la semana, de lunes a domingo, con el número arriba de cada barra */
export function GraficoDias({ dias }: GraficoDiasProps) {
  const styles = useStyles(createStyles);
  const tope = Math.max(1, ...dias.map((dia) => dia.pedidos));

  return (
    <View style={styles.grafico}>
      {dias.map((dia) => (
        <View key={dia.dia} style={styles.columna} accessible accessibilityLabel={`${dia.dia}: ${textoPedidos(dia.pedidos)}`}>
          <Text variant="caption" color={dia.pedidos > 0 ? 'text' : 'textMuted'}>
            {dia.pedidos}
          </Text>
          <View style={styles.lugar}>
            <View style={[styles.barra, { height: `${(dia.pedidos / tope) * 100}%` }]} />
          </View>
          <Text variant="caption" color="textMuted">
            {DIA_CORTO[dia.dia]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grafico: { flexDirection: 'row', gap: theme.spacing.xs },
    columna: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
    // La línea de abajo es el cero: las barras salen de ahí
    lugar: {
      height: theme.sizes.graficoChico,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    barra: {
      width: '70%',
      maxWidth: theme.spacing.xl,
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
  });
