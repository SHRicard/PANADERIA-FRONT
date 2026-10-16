import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Adorno, ControlCantidad, Miniatura, Sello, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar, textoAnticipacion } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { lineaDelGusto, textoPeso } from '../textos';
import type { ProductoCatalogo } from '../types';
import { PuntajeChico } from './PuntajeChico';

interface SeccionCartaProps {
  gusto: string;
  productos: ProductoCatalogo[];
  alAbrir: (id: string) => void;
  /** En la compu las fotos y las letras van más grandes */
  grande: boolean;
  /** Cuántos de cada producto hay en el pedido */
  cantidadDe: (id: string) => number;
  alCambiarCantidad: (id: string, cantidad: number) => void;
  maxUnidades: number;
  onLayout?: (evento: LayoutChangeEvent) => void;
}

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/** Un gusto de la carta: su título y sus productos, con la descripción a la vista y el precio con puntitos */
export function SeccionCarta({
  gusto,
  productos,
  alAbrir,
  grande,
  cantidadDe,
  alCambiarCantidad,
  maxUnidades,
  onLayout,
}: SeccionCartaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const linea = lineaDelGusto(gusto);

  return (
    <View style={styles.seccion} onLayout={onLayout}>
      <View style={styles.titulo}>
        <Text variant="heading" accessibilityRole="header">
          {gusto}
        </Text>
        <Text variant="caption" color="textMuted">
          {cantidad(productos.length)}
        </Text>
      </View>
      <Adorno forma="izquierda" />
      {linea && (
        <Text color="textMuted" style={styles.linea}>
          {linea}
        </Text>
      )}
      {productos.map((producto, indice) => {
        const nombre = nombreParaMostrar(producto.nombre);
        const precio = formatearPrecio(producto.precio);
        const datos = [
          producto.pesoGramos && textoPeso(producto.pesoGramos),
          textoAnticipacion(producto.anticipacionHoras),
          producto.cantidadImagenes > 1 && `${producto.cantidadImagenes} fotos`,
        ].filter(Boolean);
        return (
          // La fila no es un solo botón: el «+» va adentro y en la web un botón no puede ir dentro de otro.
          // La foto y el texto abren el detalle; para el lector de pantalla, solo el texto (uno por producto)
          <View key={producto._id} style={[styles.fila, indice > 0 && styles.separada]}>
            <Pressable
              onPress={() => alAbrir(producto._id)}
              accessible={false}
              focusable={false}
              style={({ pressed }) => pressed && styles.presionada}
            >
              <Miniatura uri={producto.portada} lado={grande ? theme.sizes.fotoCartaGrande : theme.sizes.fotoCarta} />
            </Pressable>
            <View style={styles.textos}>
              <Pressable
                onPress={() => alAbrir(producto._id)}
                accessibilityRole="button"
                accessibilityLabel={[nombre, producto.etiqueta, precio].filter(Boolean).join(', ')}
                style={({ pressed }) => [styles.abrir, pressed && styles.presionada]}
              >
                {/* La etiqueta del dueño («Promo lanzamiento») arriba del nombre: el sello, recto */}
                {producto.etiqueta ? (
                  <View style={styles.etiqueta}>
                    <Sello texto={producto.etiqueta} recto />
                  </View>
                ) : null}
                <View style={styles.renglon}>
                  <Text variant="bodyStrong" style={styles.nombre}>
                    {nombre}
                  </Text>
                  <View style={styles.puntitos} />
                  <Text variant="bodyStrong" style={styles.precio}>
                    {precio}
                  </Text>
                </View>
                {/* Un solo renglón, con «…»: la descripción entera está en el detalle */}
                {producto.descripcion ? (
                  <Text color="textMuted" numberOfLines={1}>
                    {producto.descripcion}
                  </Text>
                ) : null}
              </Pressable>
              <View style={styles.pie}>
                {/* El peso y las fotos; abajo, si alguien lo votó, cómo lo recomiendan */}
                <View style={styles.datos}>
                  <Text variant="caption" color="textMuted">
                    {datos.join(' · ')}
                  </Text>
                  {producto.puntajePromedio !== null && (
                    <PuntajeChico promedio={producto.puntajePromedio} cantidad={producto.cantidadRecomendaciones} />
                  )}
                </View>
                <ControlCantidad
                  valor={cantidadDe(producto._id)}
                  alCambiar={(cantidad) => alCambiarCantidad(producto._id, cantidad)}
                  max={maxUnidades}
                  nombre={nombre}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.xs, paddingTop: theme.spacing.xl },
    titulo: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
    fila: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    separada: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    presionada: { opacity: theme.opacity.pressed },
    textos: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    abrir: { gap: theme.spacing.xxs },
    // Un poco de aire entre el sello y el nombre
    etiqueta: { paddingBottom: theme.spacing.xxs },
    // La presentación del gusto, en cursiva como una nota de la carta
    linea: { fontStyle: 'italic', paddingTop: theme.spacing.xs },
    renglon: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
    nombre: { flexShrink: 1 },
    // Los puntitos de carta entre el nombre y el precio
    puntitos: {
      flex: 1,
      minWidth: theme.spacing.md,
      borderBottomWidth: 1,
      borderStyle: 'dotted',
      borderColor: theme.colors.border,
    },
    precio: { fontVariant: ['tabular-nums'] },
    // Los datos a la izquierda y el «+» a la derecha, debajo del precio
    pie: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingTop: theme.spacing.xs },
    datos: { flex: 1, gap: theme.spacing.xxs },
  });
