import { StyleSheet, View } from 'react-native';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';
import { BotonRedondo } from './BotonRedondo';
import { IconoPestana } from './IconoPestana';

/** El ícono de la pestaña, el título con qué es el apartado y el botón redondo. La línea dorada se desvanece */
export function EncabezadoIcono({ titulo, subtitulo, icono, accion }: EncabezadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <View style={styles.fila}>
        <IconoPestana icono={icono} tamano="grande" />
        <View style={styles.textos}>
          <Text variant="heading" numberOfLines={1}>
            {titulo}
          </Text>
          <Text variant="label" color="textMuted">
            {subtitulo}
          </Text>
        </View>
        {accion && <BotonRedondo accion={accion} variante="borde" />}
      </View>
      <Adorno forma="izquierda" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: { gap: theme.spacing.lg },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
