import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { PatronNavidad, Vivo, type DibujoPatron } from '@/features/catalogo/components/navidad/adornos';
import { EsqueletoNavidad } from '@/features/catalogo/components/navidad/EsqueletoNavidad';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { CieloNocheNavidad } from '@/features/catalogo/components/navidad/noche/CieloNocheNavidad';

// La mascota de cada sección, por turno, que flota en su medalla
const MASCOTAS: NombreAssetNavidad[] = ['osoGalleta', 'renoGorro', 'munecoNieveGalera', 'bolitaGorro', 'esferaCarita', 'coronaCarita', 'osoGorro'];

// El fondo de la noche: lo frío y lo dorado, uno y uno, con estrellitas que titilan entre ellos y todo cayendo despacio,
// como la nieve
const NOCHE_NEVADA: DibujoPatron[] = [
  { nombre: 'esferaAzulMono', giro: -10 },
  { nombre: 'campanaDorada', giro: 14 },
  { nombre: 'arbol', giro: -6 },
  { nombre: 'bota', giro: 12 },
  { nombre: 'regaloAzul', giro: -14 },
  { nombre: 'munecoNieveGalera', giro: 8 },
];

/**
 * El catálogo de Navidad de noche (`noche-navidad`): arriba, el cielo de borde a borde con la aurora, las estrellas, la
 * nieve, la guirnalda viva y los personajes en las lomas; abajo, la página blanca fría con un patrón de noche fijo detrás
 * (dibujos fríos y dorados con estrellitas que titilan, cayendo despacio como la nieve), cada sección presentada por su
 * mascota y los productos como en la carta, cada uno en su tarjeta blanca (el patrón no pasa detrás del texto),
 * entrando de a uno
 */
export function CatalogoNocheNavidadScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <EsqueletoNavidad
      fondo={<PatronNavidad dibujos={NOCHE_NEVADA} entre="estrella" deriva="cae" />}
      encima={<CieloNocheNavidad />}
      tarjetas="lisa"
      cabecera={null}
      seccion={(titulo, cantidad, indice) => (
        <View style={styles.titulo}>
          <View style={styles.medalla}>
            <Vivo como="flotar" fase={indice * 0.4}>
              <Ilustracion nombre={MASCOTAS[indice % MASCOTAS.length]} alto={theme.sizes.mascota} />
            </Vivo>
          </View>
          <Text variant="heading" accessibilityRole="header" style={styles.nombre}>
            {titulo}
          </Text>
          <View style={styles.cuenta}>
            <Text variant="label" color="primary" style={styles.negrita}>
              {cantidad}
            </Text>
          </View>
        </View>
      )}
      vacio={
        <Vivo como="flotar">
          <Ilustracion nombre="globoNieve" alto={theme.sizes.ilustracionVacio} />
        </Vivo>
      }
      pie={
        <Vivo como="saludar">
          <Ilustracion nombre="munecoNieveBaston" alto={theme.sizes.ilustracionPie} />
        </Vivo>
      }
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    titulo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    medalla: {
      width: theme.sizes.mascota + theme.spacing.lg,
      height: theme.sizes.mascota + theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.md}px ${theme.colors.shadow}`,
    },
    nombre: { flexShrink: 1 },
    cuenta: {
      minWidth: theme.sizes.insignia + theme.spacing.sm,
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },
    negrita: { fontFamily: theme.fonts.textoNegrita },
  });
