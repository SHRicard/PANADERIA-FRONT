import { StyleSheet, View } from 'react-native';
import { useBreakpoint } from '@/shared/hooks';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Vivo, type Movimiento } from '@/features/catalogo/components/navidad/adornos';
import { Ilustracion } from '@/features/catalogo/components/navidad/Ilustracion';
import { TEXTOS_NAVIDAD } from '@/features/catalogo/textos';

// Los tres dibujos de arriba, de izquierda a derecha: el del medio, más grande
const DIBUJOS: { nombre: NombreAssetNavidad; como: Movimiento; centro?: boolean }[] = [
  { nombre: 'campanaAcebo', como: 'mecer' },
  { nombre: 'arbol', como: 'latir', centro: true },
  { nombre: 'regaloDoradoAcebo', como: 'saltar' },
];

/**
 * El saludo de arriba de la Navidad de día, abierto sobre el fondo (sin caja): tres dibujos con su movimiento (la campana
 * se mece, el árbol respira, el regalo salta), «Temporada de fiestas», «¡Feliz Navidad!», un texto cálido, la línea
 * dorada y el cierre. Centrado; el texto, en renglones cómodos
 */
export function SaludoNavidad() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';
  const { feliz } = TEXTOS_NAVIDAD;
  const lado = enCompu ? theme.sizes.saludoDibujoCompu : theme.sizes.saludoDibujo;
  const centro = enCompu ? theme.sizes.saludoDibujoCentroCompu : theme.sizes.saludoDibujoCentro;

  return (
    <View style={styles.saludo}>
      <View style={styles.dibujos} aria-hidden>
        {DIBUJOS.map(({ nombre, como, centro: esCentro }, i) => (
          <Vivo key={nombre} como={como} fase={i * 0.35}>
            <Ilustracion nombre={nombre} alto={esCentro ? centro : lado} />
          </Vivo>
        ))}
      </View>
      <Text variant="overline" color="accent" align="center">
        {feliz.temporada}
      </Text>
      <Text variant={enCompu ? 'hero' : 'display'} align="center" accessibilityRole="header">
        {feliz.titulo}
      </Text>
      <Text color="textMuted" align="center" style={styles.texto}>
        {feliz.texto}
      </Text>
      <Adorno forma="corto" />
      <Text variant="bodyStrong" color="primary" align="center">
        {feliz.cierre}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    saludo: { alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
    // Los tres parados en la misma línea de abajo
    dibujos: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xs,
    },
    texto: { maxWidth: theme.sizes.saludoTexto },
  });
