import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { fondoDegradado, useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Ilustracion } from './Ilustracion';

interface TarjetaNavidadProps {
  /** Su lugar en la sección: elige el dibujo, así no se repite en la de al lado */
  indice: number;
  children: ReactNode;
}

// Los dibujos de marca de agua, por turno, cada uno apenas torcido
const DIBUJOS: { nombre: NombreAssetNavidad; giro: number }[] = [
  { nombre: 'acebo', giro: -14 },
  { nombre: 'galletaEstrella', giro: 12 },
  { nombre: 'campanaAcebo', giro: -8 },
  { nombre: 'esferaRojaCopo', giro: 10 },
  { nombre: 'bastonesCruzados', giro: -12 },
  { nombre: 'regaloDoradoAcebo', giro: 8 },
];

/**
 * La tarjeta de un producto en la Navidad de día, «Luz dorada» (la que eligió el dueño, docs/catalogo-navidad.md): un
 * degradado cálido con una luz dorada prendida en la esquina de arriba y, detrás, un dibujo de Navidad grande y suave
 * que asoma cortado por el borde derecho, como una marca de agua (el precio y el «+» se leen encima). Lo de adentro es
 * la fila de la carta
 */
export function TarjetaNavidad({ indice, children }: TarjetaNavidadProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const dibujo = DIBUJOS[indice % DIBUJOS.length];

  return (
    <View style={styles.tarjeta}>
      <View style={[styles.marcaDeAgua, { transform: [{ rotate: `${dibujo.giro}deg` }] }]}>
        <Ilustracion nombre={dibujo.nombre} alto={theme.sizes.dibujoTarjeta} />
      </View>
      {children}
    </View>
  );
}

const createStyles = (theme: Theme) => {
  const { colors, sizes } = theme;
  return StyleSheet.create({
    // Cálida de arriba abajo, con la luz dorada en la esquina de arriba a la derecha. Una sombra cerca, que marca el
    // borde, y otra lejos y suave, que la levanta del patrón
    tarjeta: {
      position: 'relative',
      overflow: 'hidden',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      boxShadow: `0 1px ${theme.spacing.xxs}px ${colors.shadow}, 0 ${theme.spacing.sm}px ${theme.spacing.xl}px ${colors.shadow}`,
      ...fondoDegradado(
        `radial-gradient(circle at 100% 0%, ${colors.resplandor} 0%, transparent 55%), linear-gradient(170deg, ${colors.surface} 0%, ${colors.background} 100%)`,
      ),
    },
    // Pegada al borde derecho y a la mitad de alto, con un tercio afuera (la tarjeta la corta)
    marcaDeAgua: {
      position: 'absolute',
      top: '50%',
      right: -sizes.dibujoTarjeta / 3,
      marginTop: -sizes.dibujoTarjeta / 2,
      opacity: theme.opacity.dibujoTarjeta,
      pointerEvents: 'none',
    },
  });
};
