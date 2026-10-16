import { Pressable, StyleSheet, View } from 'react-native';
import { useBreakpoint, type Breakpoint } from '@/shared/hooks';
import { ControlCantidad, Miniatura, Sello, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar, textoAnticipacion } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { textoPeso } from '../textos';
import type { ProductoCatalogo } from '../types';
import { PuntajeChico } from './PuntajeChico';

// Mobile-first: 2 por fila en el celular, más a medida que hay ancho
const COLUMNAS: Record<Breakpoint, number> = { celular: 2, tableta: 3, compu: 4 };

interface GrillaVidrieraProps {
  productos: ProductoCatalogo[];
  alAbrir: (id: string) => void;
  /** Cuántos de cada producto hay en el pedido */
  cantidadDe: (id: string) => number;
  alCambiarCantidad: (id: string, cantidad: number) => void;
  maxUnidades: number;
}

/** Los productos en una grilla de fotos grandes, con el nombre y el precio abajo */
export function GrillaVidriera({ productos, alAbrir, cantidadDe, alCambiarCantidad, maxUnidades }: GrillaVidrieraProps) {
  const styles = useStyles(createStyles);
  const columnas = COLUMNAS[useBreakpoint()];

  // De a filas: cada tarjeta ocupa lo mismo, y la última fila no se estira si queda incompleta
  const filas: ProductoCatalogo[][] = [];
  for (let i = 0; i < productos.length; i += columnas) filas.push(productos.slice(i, i + columnas));

  return (
    <View style={styles.grilla}>
      {filas.map((fila) => (
        <View key={fila[0]._id} style={styles.fila}>
          {Array.from({ length: columnas }, (_, i) => {
            const producto = fila[i];
            if (!producto) return <View key={`hueco-${i}`} style={styles.celda} />;
            const nombre = nombreParaMostrar(producto.nombre);
            const precio = formatearPrecio(producto.precio);
            return (
              // La tarjeta no es un solo botón: el «+» va adentro y en la web un botón no puede ir dentro de otro
              <View key={producto._id} style={[styles.celda, styles.tarjeta]}>
                <Pressable
                  onPress={() => alAbrir(producto._id)}
                  accessibilityRole="button"
                  accessibilityLabel={[nombre, producto.etiqueta, precio].filter(Boolean).join(', ')}
                  style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
                >
                  <View>
                    <Miniatura uri={producto.portada} cantidad={producto.cantidadImagenes} />
                    {/* La etiqueta del dueño sobre la foto, arriba a la izquierda (abajo va cuántas fotos tiene) */}
                    {producto.etiqueta ? (
                      <View style={styles.sello}>
                        <Sello texto={producto.etiqueta} />
                      </View>
                    ) : null}
                  </View>
                  <Text variant="bodyStrong" numberOfLines={2}>
                    {nombre}
                  </Text>
                </Pressable>
                <View style={styles.textos}>
                  <View style={styles.precioFila}>
                    <Text variant="bodyStrong" color="primary" style={styles.precio}>
                      {precio}
                    </Text>
                    <ControlCantidad
                      valor={cantidadDe(producto._id)}
                      alCambiar={(cantidad) => alCambiarCantidad(producto._id, cantidad)}
                      max={maxUnidades}
                      nombre={nombre}
                    />
                  </View>
                  <Text variant="caption" color="textMuted">
                    {[producto.categoria, producto.pesoGramos && textoPeso(producto.pesoGramos), textoAnticipacion(producto.anticipacionHoras)]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                  {producto.puntajePromedio !== null && (
                    <PuntajeChico promedio={producto.puntajePromedio} cantidad={producto.cantidadRecomendaciones} />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grilla: { gap: theme.spacing.xl },
    fila: { flexDirection: 'row', gap: theme.spacing.md },
    celda: { flex: 1, minWidth: 0 },
    tarjeta: { gap: theme.spacing.sm },
    presionada: { opacity: theme.opacity.pressed },
    sello: { position: 'absolute', top: theme.spacing.sm, left: theme.spacing.sm, right: theme.spacing.sm },
    textos: { gap: theme.spacing.xxs },
    // Cifras de ancho fijo: los precios de una fila quedan parejos
    precio: { flexShrink: 1, fontVariant: ['tabular-nums'] },
    // El precio a la izquierda y el «+» a la derecha
    precioFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.xs },
  });
