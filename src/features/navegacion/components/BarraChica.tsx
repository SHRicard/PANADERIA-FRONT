import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';
import { BotonRedondo } from './BotonRedondo';
import { IconoPestana } from './IconoPestana';

// Aparece y se va rápido: es un cambio de estado, no una animación para mirar
const DURACION_MS = 150;

interface BarraChicaProps extends EncabezadoProps {
  /** Lo que va a la izquierda del título */
  inicio: 'logo' | 'icono' | 'nada';
  /** Título al centro o a la izquierda */
  centrada: boolean;
  boton: 'lleno' | 'borde';
  /** La línea de abajo: la dorada que se desvanece, como el adorno del encabezado, o la fina de los bordes */
  linea: 'dorada' | 'borde';
}

/** La barra que queda arriba al bajar, cuando el encabezado grande ya se fue con el scroll */
function BarraChica({ titulo, icono, accion, inicio, centrada, boton, linea }: BarraChicaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <Animated.View
      entering={FadeIn.duration(DURACION_MS)}
      exiting={FadeOut.duration(DURACION_MS)}
      style={[styles.barra, linea === 'borde' && styles.lineaBorde]}
    >
      <View style={styles.fila}>
        {inicio === 'logo' && (
          <View style={centrada && styles.lado}>
            <LogoDamaBlanca width={theme.sizes.logoMini} height={theme.sizes.logoMini} aria-hidden />
          </View>
        )}
        {inicio === 'icono' && <IconoPestana icono={icono} tamano="chico" />}
        {/* Sin nada a la izquierda, un hueco del mismo ancho que el botón: así el título centrado queda al centro */}
        {inicio === 'nada' && centrada && <View style={styles.lado} />}

        <Text variant="title" numberOfLines={1} align={centrada ? 'center' : 'left'} style={styles.titulo}>
          {titulo}
        </Text>
        <View style={[styles.lado, styles.derecha]}>{accion && <BotonRedondo accion={accion} variante={boton} />}</View>
      </View>
      {linea === 'dorada' && <Adorno forma="izquierda" />}
    </Animated.View>
  );
}

export function BarraChicaRevista(props: EncabezadoProps) {
  return <BarraChica {...props} inicio="logo" centrada={false} boton="lleno" linea="borde" />;
}

export function BarraChicaCarta(props: EncabezadoProps) {
  return <BarraChica {...props} inicio="logo" centrada boton="borde" linea="borde" />;
}

export function BarraChicaSimple(props: EncabezadoProps) {
  return <BarraChica {...props} inicio="nada" centrada={false} boton="borde" linea="dorada" />;
}

export function BarraChicaCentrado(props: EncabezadoProps) {
  return <BarraChica {...props} inicio="nada" centrada boton="borde" linea="dorada" />;
}

export function BarraChicaIcono(props: EncabezadoProps) {
  return <BarraChica {...props} inicio="icono" centrada={false} boton="borde" linea="dorada" />;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: {
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xs,
      backgroundColor: theme.colors.background,
    },
    lineaBorde: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      minHeight: theme.sizes.control + theme.spacing.sm,
    },
    titulo: { flex: 1 },
    // Los dos lados del mismo ancho: así el título centrado queda en el centro de verdad
    lado: { width: theme.sizes.touchMin },
    derecha: { alignItems: 'flex-end' },
  });
