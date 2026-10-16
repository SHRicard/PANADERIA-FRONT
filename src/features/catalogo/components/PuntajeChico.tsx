import { StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { fraseRecomendacion, textoPromedio } from '../textos';

interface PuntajeChicoProps {
  /** El promedio de estrellas. Sin votos no se llama: no se muestra nada */
  promedio: number;
  cantidad: number;
}

/** Cómo lo recomiendan, en la lista y discreto: una estrellita dorada, «4,8» y una frase («¡El ganador de 12 clientes!») */
export function PuntajeChico({ promedio, cantidad }: PuntajeChicoProps) {
  const styles = useStyles(createStyles);
  const frase = fraseRecomendacion(promedio, cantidad);

  return (
    <View style={styles.puntaje} accessible aria-label={`${textoPromedio(promedio)} de 5 estrellas: ${frase}`}>
      <Icon icon={Star} size="xs" color="accent" relleno="lleno" />
      <Text variant="caption">{textoPromedio(promedio)}</Text>
      <Text variant="caption" color="primary" style={styles.frase}>
        {frase}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    puntaje: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    // En cursiva, como una nota escrita a mano
    frase: { flexShrink: 1, fontStyle: 'italic' },
  });
