import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, Search } from 'lucide-react-native';
import { Cargando, Icon, Input, Miniatura, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { useBuscadorRapido } from '../../hooks/useBuscadorRapido';

/** El campo para buscar un producto y, debajo, los que coinciden: al tocar uno, abre su detalle */
export function BuscadorRapido() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const buscador = useBuscadorRapido();

  return (
    <View style={styles.buscador}>
      <Input
        icon={Search}
        value={buscador.texto}
        onChangeText={buscador.setTexto}
        onSubmitEditing={buscador.abrirPrimero}
        returnKeyType="search"
        placeholder="Ej.: pastafrola, budín, chipá…"
        accessibilityLabel="Buscar un producto"
        autoCorrect={false}
      />

      {buscador.buscando ? (
        <Cargando tamano="chico" mensaje="Buscando…" />
      ) : buscador.error ? (
        <Text variant="caption" color="danger" align="center">
          No pudimos buscar. Probá de nuevo o volvé al catálogo.
        </Text>
      ) : buscador.sinResultados ? (
        <Text variant="caption" color="textMuted" align="center">
          No encontramos «{buscador.texto.trim()}». Probá con otra palabra.
        </Text>
      ) : (
        buscador.resultados.length > 0 && (
          <View style={styles.lista} accessibilityRole="list">
            {buscador.resultados.map((producto, i) => (
              <Pressable
                key={producto._id}
                onPress={() => buscador.abrir(producto._id)}
                // Un botón y no un link: sin `href`, en la web un link no se abre con Enter ni Espacio (sí con el mouse)
                accessibilityRole="button"
                accessibilityHint="Abre el producto"
                accessibilityLabel={`${nombreParaMostrar(producto.nombre)}, ${formatearPrecio(producto.precio)}`}
                style={({ pressed }) => [styles.fila, i > 0 && styles.separada, pressed && styles.presionada]}
              >
                <Miniatura uri={producto.portada} lado={theme.sizes.control} />
                <View style={styles.datos}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {nombreParaMostrar(producto.nombre)}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {formatearPrecio(producto.precio)}
                  </Text>
                </View>
                <Icon icon={ChevronRight} color="textMuted" />
              </Pressable>
            ))}
          </View>
        )
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    buscador: { alignSelf: 'stretch', gap: theme.spacing.sm },
    lista: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.sm },
    separada: { borderTopWidth: 1, borderTopColor: theme.colors.border },
    presionada: { backgroundColor: theme.colors.surfaceMuted },
    datos: { flex: 1, gap: theme.spacing.xxs },
  });
