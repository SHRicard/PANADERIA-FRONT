import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

/** Los primeros puestos van en el color de la marca; el resto, apagado */
const PODIO = 3;

interface FilaRankingProps {
  /** Desde 1. Sin puesto, la fila no se numera (los estados de los pedidos) */
  puesto?: number;
  titulo: string;
  /** Lo que manda (unidades, plata, cantidad): a la derecha del título */
  valor: string;
  /** Qué parte del total es, de 0 a 100: el largo de la barra */
  porcentaje: number;
  /** Abajo, en chico */
  detalle?: string;
  /** Debajo de todo: la variación de precio de un insumo */
  extra?: ReactNode;
  /** Lo que dice `extra`, para el lector de pantalla */
  textoExtra?: string;
  /** Abre otra pantalla (el insumo): suma la flecha */
  onPress?: () => void;
}

/** Una fila de un ranking: el puesto, el nombre, lo que manda y una barra con su parte del total */
export function FilaRanking({ puesto, titulo, valor, porcentaje, detalle, extra, textoExtra, onPress }: FilaRankingProps) {
  const styles = useStyles(createStyles);
  const etiqueta = [
    `${puesto ? `${puesto}. ` : ''}${titulo}: ${valor}, el ${porcentaje}% del total`,
    detalle,
    textoExtra,
  ]
    .filter(Boolean)
    .join('. ');

  const contenido = (
    <>
      {puesto !== undefined && (
        <Text variant="bodyStrong" color={puesto <= PODIO ? 'primary' : 'textMuted'} style={styles.puesto}>
          {puesto}
        </Text>
      )}
      <View style={styles.datos}>
        <View style={styles.linea}>
          <Text variant="bodyStrong" numberOfLines={2} style={styles.izquierda}>
            {titulo}
          </Text>
          <Text variant="bodyStrong">{valor}</Text>
        </View>
        <View style={styles.barra}>
          <View style={[styles.relleno, { width: `${porcentaje}%` }]} />
        </View>
        <View style={styles.linea}>
          <Text variant="caption" color="textMuted" style={styles.izquierda}>
            {detalle}
          </Text>
          <Text variant="caption" color="textMuted">
            {porcentaje}%
          </Text>
        </View>
        {extra}
      </View>
      {onPress && <Icon icon={ChevronRight} color="textMuted" />}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={etiqueta}
        style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
      >
        {contenido}
      </Pressable>
    );
  }
  return (
    <View style={styles.fila} accessible accessibilityLabel={etiqueta}>
      {contenido}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    presionada: { opacity: theme.opacity.pressed },
    // Ancho fijo: los nombres quedan alineados aunque el puesto tenga dos cifras
    puesto: { minWidth: theme.spacing.xl, textAlign: 'center', alignSelf: 'flex-start' },
    datos: { flex: 1, gap: theme.spacing.xs },
    linea: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
    izquierda: { flex: 1 },
    barra: {
      height: theme.spacing.xs,
      borderRadius: theme.radius.full,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    relleno: { height: '100%', borderRadius: theme.radius.full, backgroundColor: theme.colors.primary },
  });
