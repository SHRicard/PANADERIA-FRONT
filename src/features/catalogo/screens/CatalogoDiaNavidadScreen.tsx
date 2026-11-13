import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { PatronNavidad, Vivo, type DibujoPatron } from '@/features/catalogo/components/navidad/adornos';
import { EsqueletoNavidad } from '@/features/catalogo/components/navidad/EsqueletoNavidad';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { CabeceraDiaNavidad } from '@/features/catalogo/components/navidad/dia/CabeceraDiaNavidad';

// El dibujo al lado del título de cada sección, por turno: se mece como colgado
const DIBUJOS_SECCION: NombreAssetNavidad[] = ['campanaAcebo', 'acebo', 'galletaEstrella', 'bastonesCruzados', 'regaloDoradoAcebo'];

// El papel de regalo del fondo: los dibujos de la mesa de las fiestas, con un puntito dorado entre ellos
const PAPEL_DE_REGALO: DibujoPatron[] = [
  { nombre: 'baston', giro: -18 },
  { nombre: 'galletaEstrella', giro: 12 },
  { nombre: 'esferaRojaCopo', giro: -8 },
  { nombre: 'acebo', giro: 16 },
  { nombre: 'regaloVerde', giro: -12 },
  { nombre: 'campanaAcebo', giro: 8 },
];

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * El catálogo de Navidad de día (`dia-navidad`): arriba, una vidriera de noche enmarcada por la guirnalda de pino con
 * luces vivas, con los personajes adentro; abajo, la página crema con un patrón de dibujos navideños fijo detrás (como un
 * papel de regalo que deriva despacio), los productos como en la carta, cada uno en su tarjeta, y un dibujo que se mece al
 * lado de cada sección
 */
export function CatalogoDiaNavidadScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <EsqueletoNavidad
      fondo={<PatronNavidad dibujos={PAPEL_DE_REGALO} />}
      tarjetas="luz"
      cabecera={<CabeceraDiaNavidad />}
      seccion={(titulo, cantidad, indice) => (
        <View style={styles.titulo}>
          <Vivo como="mecer" fase={indice * 0.3}>
            <Ilustracion nombre={DIBUJOS_SECCION[indice % DIBUJOS_SECCION.length]} alto={theme.sizes.mascota} />
          </Vivo>
          <Text variant="heading" accessibilityRole="header" style={styles.nombre}>
            {titulo}
          </Text>
          <Text variant="caption" color="textMuted">
            {productos(cantidad)}
          </Text>
        </View>
      )}
      vacio={
        <Vivo como="flotar">
          <Ilustracion nombre="munecoNieveGorroPapaNoel" alto={theme.sizes.ilustracionVacio} />
        </Vivo>
      }
      pie={
        <Vivo como="latir">
          <Ilustracion nombre="canastaNavidena" alto={theme.sizes.ilustracionPie} />
        </Vivo>
      }
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    titulo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    nombre: { flexShrink: 1 },
  });
