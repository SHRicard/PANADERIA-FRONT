import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type ColorToken, type Theme } from '@/theme';

interface TarjetaResumenProps {
  /** Arriba, chico: qué es y de qué período ("Vendido · Este mes") */
  etiqueta: string;
  /** El número grande */
  valor: string;
  /** En rojo, por ejemplo, una ganancia negativa */
  colorValor?: ColorToken;
  /** Abajo, en chico: de dónde sale el número */
  detalle?: string;
  /** Algo más adentro de la tarjeta, debajo de todo */
  children?: ReactNode;
}

/** El número principal de una métrica, con lo que lo explica */
export function TarjetaResumen({ etiqueta, valor, colorValor = 'text', detalle, children }: TarjetaResumenProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.tarjeta}>
      <Text variant="overline" color="textMuted">
        {etiqueta}
      </Text>
      <Text variant="heading" color={colorValor}>
        {valor}
      </Text>
      {detalle ? (
        <Text variant="caption" color="textMuted">
          {detalle}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
  });
