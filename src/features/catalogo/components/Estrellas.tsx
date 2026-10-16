import { StyleSheet, View } from 'react-native';
import { Star, StarHalf } from 'lucide-react-native';
import { Icon } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { textoPromedio } from '../textos';

interface EstrellasProps {
  /** De 1 a 5; un promedio (4,3) se redondea a la media estrella más cercana (4,5) */
  puntaje: number;
  tamano?: 'sm' | 'md';
}

const ESTRELLAS = [1, 2, 3, 4, 5];

/** Un puntaje en estrellas doradas: las que tiene, macizas (o media); las que le faltan, solo el borde */
export function Estrellas({ puntaje, tamano = 'sm' }: EstrellasProps) {
  const styles = useStyles(createStyles);
  const redondeado = Math.round(puntaje * 2) / 2;

  return (
    <View style={styles.fila} accessible role="img" aria-label={`${textoPromedio(puntaje)} de 5 estrellas`}>
      {ESTRELLAS.map((estrella) =>
        estrella <= redondeado ? (
          <Icon key={estrella} icon={Star} size={tamano} color="accent" relleno="lleno" />
        ) : estrella - 0.5 === redondeado ? (
          // La media: el borde de la estrella entera y, encima, la mitad izquierda maciza
          <View key={estrella}>
            <Icon icon={Star} size={tamano} color="border" />
            <View style={StyleSheet.absoluteFill}>
              <Icon icon={StarHalf} size={tamano} color="accent" relleno="lleno" />
            </View>
          </View>
        ) : (
          <Icon key={estrella} icon={Star} size={tamano} color="border" />
        ),
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', gap: theme.spacing.xxs },
  });
