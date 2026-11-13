import { StyleSheet, View } from 'react-native';
import { useBreakpoint } from '@/shared/hooks';
import { Text } from '@/shared/ui/atoms';
import { fondoDegradado, useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import {
  Colgantes,
  Destellos,
  GuirnaldaViva,
  Nieve,
  Vivo,
  type Colgante,
  type Movimiento,
} from '@/features/catalogo/components/navidad/adornos';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { MarcaNavidad } from '@/features/catalogo/components/navidad/MarcaNavidad';
import { TEXTOS_NAVIDAD } from '@/features/catalogo/textos';

type Ancho = 'celular' | 'compu';

// Lo que cuelga de la guirnalda. En el celular, corto: queda entre la guirnalda y el saludo; en la compu, a los
// costados del saludo
const COLGANTES: Record<Ancho, Colgante[]> = {
  celular: [
    { x: 0.1, nombre: 'esferaRojaCopo', hilo: 0.2 },
    { x: 0.36, nombre: 'esferaAzulMono', hilo: 0.7 },
    { x: 0.64, nombre: 'galletaEstrella', hilo: 0.35 },
    { x: 0.9, nombre: 'campanaDorada', hilo: 0.8 },
  ],
  compu: [
    { x: 0.05, nombre: 'esferaRojaCopo', hilo: 0.3 },
    { x: 0.14, nombre: 'esferaAzulMono', hilo: 1 },
    { x: 0.24, nombre: 'galletaEstrella', hilo: 0.5 },
    { x: 0.76, nombre: 'esferaNaranja', hilo: 0.6 },
    { x: 0.86, nombre: 'campanaDorada', hilo: 1.1 },
    { x: 0.95, nombre: 'esferaRojaCopo', hilo: 0.4 },
  ],
};

// Los de adelante, parados en la loma de nieve, con su movimiento; y los arbolitos de la loma de atrás, más chicos
const ADELANTE: Record<Ancho, { nombre: NombreAssetNavidad; como: Movimiento }[]> = {
  celular: [
    { nombre: 'renoGorro', como: 'flotar' },
    { nombre: 'papaNoel', como: 'saludar' },
    { nombre: 'munecoNieveGorroPapaNoel', como: 'flotar' },
    { nombre: 'osoGorro', como: 'saltar' },
  ],
  compu: [
    { nombre: 'regaloVerde', como: 'saltar' },
    { nombre: 'renoGorro', como: 'flotar' },
    { nombre: 'osoGorro', como: 'saltar' },
    { nombre: 'papaNoel', como: 'saludar' },
    { nombre: 'munecoNieveGorroPapaNoel', como: 'flotar' },
    { nombre: 'bolitaGorro', como: 'saltar' },
    { nombre: 'regaloRojo', como: 'flotar' },
  ],
};
const ATRAS: Record<Ancho, NombreAssetNavidad[]> = {
  celular: ['arbol', 'arbol2', 'arbol', 'arbol2', 'arbol'],
  compu: ['arbol', 'arbol2', 'arbol', 'arbol2', 'arbol', 'arbol2', 'arbol', 'arbol2', 'arbol'],
};

/**
 * La noche mágica, de borde a borde arriba de todo: el cielo del negro de lo alto al del horizonte (sin aurora: sobre
 * negro, sus colores lo volvían oliva o gris), estrellas que titilan, nieve en tres capas y, arriba, la guirnalda de pino con luces vivas y esferas que se
 * mecen. La marca con el logo crema y el regalo del pedido, el saludo y dos lomas de nieve: la de atrás con arbolitos
 * lejanos y la de adelante con los personajes, cada uno con su movimiento
 */
export function CieloNocheNavidad() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const ancho: Ancho = useBreakpoint() === 'compu' ? 'compu' : 'celular';
  const enCompu = ancho === 'compu';
  const alto = enCompu ? theme.sizes.personajeEscenaCompu : theme.sizes.personajeEscena;

  return (
    <View style={styles.cielo}>
      <Destellos cantidad={enCompu ? 46 : 24} modo="estrella" hasta={0.65} />
      <Nieve cantidad={enCompu ? 120 : 64} />
      <View style={[styles.contenido, enCompu && styles.contenidoCompu]}>
        <MarcaNavidad logo="logoCrema" sobreDestacado regalo="regaloVerde" vivo />
      </View>
      <View style={styles.guirnalda}>
        <GuirnaldaViva />
        <Colgantes colgantes={COLGANTES[ancho]} lado={enCompu ? theme.sizes.colganteGrande : theme.sizes.colgante} desde={theme.sizes.guirnalda / 2} />
      </View>
      <View style={[styles.contenido, enCompu && styles.contenidoCompu, styles.debajo, enCompu && styles.debajoCompu]}>
        <View style={styles.saludo}>
          <Text variant="overline" color="accent" align="center">
            {TEXTOS_NAVIDAD.temporada}
          </Text>
          <Text variant={enCompu ? 'hero' : 'display'} color="onDestacado" align="center" accessibilityRole="header">
            {TEXTOS_NAVIDAD.saludo}
          </Text>
          <Text color="onDestacado" align="center">
            {TEXTOS_NAVIDAD.bajada}
          </Text>
        </View>
      </View>
      <View style={styles.paisaje} aria-hidden>
        <View style={styles.lomaAtras} />
        <View style={styles.arbolitos}>
          {ATRAS[ancho].map((nombre, i) => (
            <Ilustracion key={i} nombre={nombre} alto={theme.sizes.personajeLejano * (i % 2 === 0 ? 1 : 0.8)} />
          ))}
        </View>
        <View style={styles.lomaAdelante} />
        <View style={styles.personajes}>
          {ADELANTE[ancho].map(({ nombre, como }, i) => (
            <Vivo key={`${nombre}-${i}`} como={como} fase={i * 0.31}>
              <Ilustracion nombre={nombre} alto={i % 2 === 0 ? alto : alto * 0.86} />
            </Vivo>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Se come el margen de la pantalla: de borde a borde y pegado arriba
    cielo: {
      position: 'relative',
      overflow: 'hidden',
      marginHorizontal: -theme.spacing.lg,
      marginTop: -theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.destacado,
      ...fondoDegradado(`linear-gradient(to bottom, ${theme.colors.destacadoProfundo} 0%, ${theme.colors.destacado} 85%)`),
    },
    contenido: {
      width: '100%',
      maxWidth: theme.sizes.cartaMax,
      alignSelf: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    // Del ancho de la columna del catálogo, que en la compu es el 80% de la ventana
    contenidoCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    guirnalda: { position: 'relative', zIndex: 1 },
    // Debajo de la guirnalda: en el celular deja lugar para lo que cuelga
    debajo: { paddingTop: theme.sizes.colgante * 2.4 },
    debajoCompu: { paddingTop: theme.spacing.xxxl },
    saludo: { gap: theme.spacing.xs, alignItems: 'center' },
    paisaje: { marginTop: theme.spacing.xl, justifyContent: 'flex-end' },
    // Las lomas: la mitad de arriba de un óvalo (los radios en porcentaje hacen la curva). La de atrás es un óvalo
    // entero, enterrado a la mitad (así se ve solo la cúpula, curva de punta a punta, sin un tramo recto ni esquinas),
    // más ancho que la pantalla y corrido a la izquierda: la cima queda de ese lado y baja hacia la derecha, llegando a
    // los dos bordes. Translúcida y más clara arriba, como nieve lejana con la luz de la luna: está lejos
    lomaAtras: {
      position: 'absolute',
      left: '-50%',
      right: '-10%',
      bottom: -theme.sizes.loma * 3.5,
      height: theme.sizes.loma * 7,
      borderRadius: '50%',
      backgroundColor: theme.colors.nieve,
      opacity: theme.opacity.lejano,
      ...fondoDegradado(`linear-gradient(to bottom, ${theme.colors.nieve} 0%, ${theme.colors.destacado} 45%)`),
    },
    arbolitos: {
      position: 'absolute',
      left: '6%',
      right: '32%',
      bottom: theme.sizes.loma * 1.75,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      opacity: theme.opacity.lejano + 0.3,
    },
    lomaAdelante: {
      position: 'absolute',
      left: '-20%',
      right: '-20%',
      bottom: -theme.sizes.loma,
      height: theme.sizes.loma * 3,
      borderTopLeftRadius: '50%',
      borderTopRightRadius: '50%',
      backgroundColor: theme.colors.nieve,
    },
    personajes: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-evenly',
      paddingTop: theme.sizes.loma * 2.4,
      paddingBottom: theme.sizes.loma * 0.45,
    },
  });
