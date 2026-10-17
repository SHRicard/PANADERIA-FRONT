import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface TituloPasoProps {
  /** El orden real del pedido: 1 revisar, 2 ver la seña, 3 dejar los datos y confirmar */
  numero: number;
  titulo: string;
  /** Algo chico a la derecha, como cuántos productos hay */
  detalle?: string;
}

/** El título de cada paso del pedido, con su número en un círculo dorado */
export function TituloPaso({ numero, titulo, detalle }: TituloPasoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.titulo}>
      <View style={styles.numero} aria-hidden>
        <Text variant="label" color="primary" style={styles.cifra}>
          {numero}
        </Text>
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.texto}>
        {titulo}
      </Text>
      {detalle ? (
        <Text variant="caption" color="textMuted">
          {detalle}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    titulo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    numero: {
      width: theme.sizes.insignia + theme.spacing.sm,
      height: theme.sizes.insignia + theme.spacing.sm,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.primarySoft,
    },
    cifra: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    texto: { flex: 1 },
  });
