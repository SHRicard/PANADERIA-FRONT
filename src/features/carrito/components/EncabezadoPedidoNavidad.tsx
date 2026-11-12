import { StyleSheet, View } from 'react-native';
import { IlustracionNavidad, Vivo, type Movimiento, type NombreAssetNavidad } from '@/features/catalogo';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TEXTOS_PEDIDO_NAVIDAD } from '../textos';

// La escena de arriba, de izquierda a derecha: la canasta en el medio, más grande; los de los costados, apenas torcidos
const ESCENA: { nombre: NombreAssetNavidad; como: Movimiento; centro?: boolean; giro?: number }[] = [
  { nombre: 'bastonesCruzados', como: 'mecer', giro: -10 },
  { nombre: 'canastaNavidena', como: 'latir', centro: true },
  { nombre: 'galletaEstrella', como: 'saltar', giro: 12 },
];

/**
 * Arriba de «Tu pedido» mientras la web está de Navidad: primero una escena (la canasta navideña que late, con los
 * bastones que se mecen y la galletita que salta a los costados), después «Para tu mesa de fiestas», el título, la
 * bajada y la línea dorada. Todo centrado, abierto (sin caja)
 */
export function EncabezadoPedidoNavidad() {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <View style={styles.escena} aria-hidden>
        {ESCENA.map(({ nombre, como, centro, giro = 0 }, i) => (
          <View key={nombre} style={[!centro && styles.costado, { transform: [{ rotate: `${giro}deg` }] }]}>
            <Vivo como={como} fase={i * 0.35}>
              <IlustracionNavidad nombre={nombre} alto={centro ? theme.sizes.pedidoDibujoCentro : theme.sizes.pedidoDibujo} />
            </Vivo>
          </View>
        ))}
      </View>
      <Text variant="overline" color="accent" align="center">
        {TEXTOS_PEDIDO_NAVIDAD.temporada}
      </Text>
      <Text variant="display" align="center" accessibilityRole="header">
        Tu pedido
      </Text>
      <Text color="textMuted" align="center" style={styles.bajada}>
        {TEXTOS_PEDIDO_NAVIDAD.bajada}
      </Text>
      <Adorno forma="corto" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    encabezado: { alignItems: 'center', gap: theme.spacing.xs },
    // Los tres sobre la misma línea de abajo; los de los costados, un poco más arriba que el piso de la canasta
    escena: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    costado: { marginBottom: theme.spacing.md },
    bajada: { maxWidth: theme.sizes.saludoTexto },
  });
