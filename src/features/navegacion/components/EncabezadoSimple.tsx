import { StyleSheet, View } from 'react-native';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';
import { BotonRedondo } from './BotonRedondo';

/** El título y qué es el apartado a la izquierda, el botón redondo a la derecha y la línea dorada de lado a lado */
export function EncabezadoSimple({ titulo, subtitulo, accion }: EncabezadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <View style={styles.fila}>
        <View style={styles.textos}>
          <Text variant="display" numberOfLines={1}>
            {titulo}
          </Text>
          <Text color="textMuted">{subtitulo}</Text>
        </View>
        {accion && <BotonRedondo accion={accion} variante="borde" />}
      </View>
      <Adorno forma="ancho" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: { gap: theme.spacing.lg },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
