import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { formatearNumero, parteDe } from '../textos';

export interface Parte {
  label: string;
  valor: number;
}

interface BarraPartesProps {
  /** Las dos partes de un total: la primera va en grafico1 y la segunda en grafico2 */
  partes: readonly [Parte, Parte];
  /** Para el lector de pantalla: de qué es el total ("Pedidos según de dónde llegan") */
  accessibilityLabel: string;
}

const COLORES = ['grafico1', 'grafico2'] as const;

/**
 * Un total partido en dos (web y a mano, nuevos y los que vuelven): una barra con cada parte y, abajo, la leyenda
 * con el número y el porcentaje, así no depende solo del color
 */
export function BarraPartes({ partes, accessibilityLabel }: BarraPartesProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const total = partes[0].valor + partes[1].valor;
  const lectura = partes.map((parte) => `${parte.label}: ${parte.valor}, el ${parteDe(parte.valor, total)}%`).join('. ');

  return (
    <View style={styles.caja} accessible accessibilityLabel={`${accessibilityLabel}. ${lectura}`}>
      <View style={styles.barra}>
        {partes.map((parte, indice) =>
          parte.valor > 0 ? (
            <View key={parte.label} style={[styles.segmento, { flex: parte.valor, backgroundColor: theme.colors[COLORES[indice]] }]} />
          ) : null
        )}
      </View>
      <View style={styles.leyenda}>
        {partes.map((parte, indice) => (
          <View key={parte.label} style={styles.item}>
            <View style={[styles.muestra, { backgroundColor: theme.colors[COLORES[indice]] }]} />
            <Text style={styles.label}>{parte.label}</Text>
            <Text variant="bodyStrong">{formatearNumero(parte.valor)}</Text>
            <Text variant="caption" color="textMuted" style={styles.porcentaje}>
              {parteDe(parte.valor, total)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    caja: { gap: theme.spacing.md },
    // El hueco entre las dos partes es del color de la superficie: se separan aunque los colores se parezcan
    barra: {
      flexDirection: 'row',
      gap: theme.spacing.xxs,
      height: theme.spacing.md,
      borderRadius: theme.radius.full,
      overflow: 'hidden',
    },
    segmento: { height: '100%' },
    leyenda: { gap: theme.spacing.sm },
    item: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    muestra: { width: theme.spacing.md, height: theme.spacing.md, borderRadius: theme.radius.sm },
    label: { flex: 1 },
    // Ancho fijo: los números quedan en columna
    porcentaje: { minWidth: theme.spacing.xxxl, textAlign: 'right' },
  });
