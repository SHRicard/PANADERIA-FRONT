import { StyleSheet, View } from 'react-native';
import { fondoDegradado, useStyles, type Theme } from '@/theme';

export interface AdornoProps {
  /**
   * `ancho`: cruza todo el ancho con el rombo al centro. `corto`: dos rayitas con el rombo, centrado.
   * `izquierda`: el rombo al principio y la línea que se desvanece hacia la derecha
   */
  forma: 'ancho' | 'corto' | 'izquierda';
}

/** La línea dorada con un rombo: separa un encabezado del contenido (las pestañas, el catálogo) */
export function Adorno({ forma }: AdornoProps) {
  const styles = useStyles(createStyles);
  const linea = [styles.linea, forma === 'corto' ? styles.lineaCorta : styles.lineaLarga];

  return (
    <View style={[styles.adorno, forma === 'corto' && styles.centrado]} aria-hidden>
      {forma !== 'izquierda' && <View style={linea} />}
      <View style={styles.rombo} />
      <View style={[linea, forma === 'izquierda' && styles.desvanecida]} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    adorno: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    centrado: { alignSelf: 'center' },
    linea: { height: 1, backgroundColor: theme.colors.accent },
    lineaCorta: { width: theme.spacing.xxl },
    lineaLarga: { flex: 1 },
    // Del dorado a nada, sin librerías
    desvanecida: {
      backgroundColor: 'transparent',
      ...fondoDegradado(`linear-gradient(to right, ${theme.colors.accent}, transparent)`),
    },
    rombo: {
      width: theme.spacing.xs + theme.spacing.xxs,
      height: theme.spacing.xs + theme.spacing.xxs,
      backgroundColor: theme.colors.accent,
      transform: [{ rotate: '45deg' }],
    },
  });
