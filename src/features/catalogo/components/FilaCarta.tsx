import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ControlCantidad, Miniatura, Sello, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar, textoAnticipacion } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { textoPeso } from '../textos';
import type { ProductoCatalogo } from '../types';
import { PuntajeChico } from './PuntajeChico';

interface FilaCartaProps {
  producto: ProductoCatalogo;
  alAbrir: (id: string) => void;
  /** En la compu la foto va más grande */
  grande: boolean;
  /** Cuántos hay en el pedido */
  cantidad: number;
  alCambiarCantidad: (id: string, cantidad: number) => void;
  maxUnidades: number;
  /** Con la línea fina arriba, que la separa de la anterior */
  separada: boolean;
  /** Cómo se dibuja la etiqueta del dueño. Por defecto, el `Sello` dorado; los catálogos de Navidad ponen la suya */
  sello?: (texto: string) => ReactNode;
}

/**
 * Un producto de la carta: la foto, el nombre con el precio y los puntitos, la descripción en un renglón, los datos y el
 * «+». La usan la carta y los catálogos de Navidad
 */
export function FilaCarta({ producto, alAbrir, grande, cantidad, alCambiarCantidad, maxUnidades, separada, sello }: FilaCartaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
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
    <View style={[styles.fila, separada && styles.separada]}>
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
              {sello ? sello(producto.etiqueta) : <Sello texto={producto.etiqueta} recto />}
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
            valor={cantidad}
            alCambiar={(nueva) => alCambiarCantidad(producto._id, nueva)}
            max={maxUnidades}
            nombre={nombre}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
    separada: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    presionada: { opacity: theme.opacity.pressed },
    textos: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    abrir: { gap: theme.spacing.xxs },
    // Un poco de aire entre el sello y el nombre
    etiqueta: { paddingBottom: theme.spacing.xxs },
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
