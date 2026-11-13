import { StyleSheet, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { NoEncontrado } from '../../hooks/useNoEncontrado';
import { BuscadorRapido } from './BuscadorRapido';
import { MarcaNoEncontrado } from './MarcaNoEncontrado';

const INGREDIENTES = ['2 tazas de harina', '3 huevos de campo', 'Manteca y mucho amor'];
const PREPARACION = ['Respirá hondo, que acá nada se quema.', 'Buscá abajo lo que se te antoja.', 'Disfrutá recién horneado.'];

/**
 * «A esta receta le falta algo» (la página de un link que no existe): la marca arriba, una ficha de receta apenas
 * torcida en la que el ingrediente que falta es la página, y abajo el buscador: escribe y toca el producto para ir
 * directo a su detalle
 */
export function NoEncontradoReceta({ pagina }: { pagina: NoEncontrado }) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.pagina}>
      <MarcaNoEncontrado />

      <View style={styles.titulo}>
        <Text variant="overline" color="primary" align="center">
          Error 404
        </Text>
        <Text variant="display" align="center" accessibilityRole="header">
          A esta receta le falta algo
        </Text>
      </View>

      <View style={styles.ficha}>
        <View style={styles.cabeceraFicha}>
          <Text variant="title" style={styles.nombreReceta}>
            Página perdida
          </Text>
          <Text variant="caption" color="primary">
            Receta N.º 404
          </Text>
        </View>

        <Text variant="overline" color="textMuted">
          Ingredientes
        </Text>
        <View accessibilityRole="list">
          {INGREDIENTES.map((ingrediente) => (
            <View key={ingrediente} style={styles.renglon}>
              <Icon icon={Check} size="sm" color="success" />
              <Text>{ingrediente}</Text>
            </View>
          ))}
          <View style={styles.renglon} accessible accessibilityLabel="Falta: la página que buscabas">
            <Icon icon={X} size="sm" color="danger" />
            <Text color="danger" style={styles.tachado}>
              La página que buscabas
            </Text>
          </View>
        </View>

        <Text variant="overline" color="textMuted" style={styles.subtitulo}>
          Preparación
        </Text>
        <View accessibilityRole="list">
          {PREPARACION.map((paso, i) => (
            <View key={paso} style={styles.renglon}>
              <Text variant="bodyStrong" color="primary">
                {i + 1}.
              </Text>
              <Text style={styles.paso}>{paso}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buscar}>
        <Text variant="title" align="center">
          ¿Qué se te antoja hoy?
        </Text>
        <BuscadorRapido />
        <Button variant="ghost" label="o volvé al catálogo" onPress={pagina.irAlCatalogo} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    pagina: { flexGrow: 1, gap: theme.spacing.xl },
    titulo: { gap: theme.spacing.xs },
    // Una ficha de papel, apenas torcida, con renglones como un cuaderno
    ficha: {
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 ${theme.spacing.sm}px ${theme.spacing.xl}px ${theme.colors.shadow}`,
      transform: [{ rotate: '-1.5deg' }],
    },
    cabeceraFicha: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.text,
    },
    nombreReceta: { flexShrink: 1 },
    subtitulo: { marginTop: theme.spacing.md },
    renglon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tachado: { textDecorationLine: 'line-through' },
    paso: { flex: 1 },
    buscar: { gap: theme.spacing.md },
  });
