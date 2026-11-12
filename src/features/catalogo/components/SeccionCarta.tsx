import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { ProductoCatalogo } from '../types';
import { FilaCarta } from './FilaCarta';

interface SeccionCartaProps {
  /** El nombre del tipo (tituloSeccion) */
  titulo: string;
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

/** Un tipo de la carta: su título y sus productos, con la descripción a la vista y el precio con puntitos */
export function SeccionCarta({
  titulo,
  productos,
  alAbrir,
  grande,
  cantidadDe,
  alCambiarCantidad,
  maxUnidades,
  onLayout,
}: SeccionCartaProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.seccion} onLayout={onLayout}>
      <View style={styles.titulo}>
        <Text variant="heading" accessibilityRole="header">
          {titulo}
        </Text>
        <Text variant="caption" color="textMuted">
          {cantidad(productos.length)}
        </Text>
      </View>
      <Adorno forma="izquierda" />
      {productos.map((producto, indice) => (
        <FilaCarta
          key={producto._id}
          producto={producto}
          alAbrir={alAbrir}
          grande={grande}
          cantidad={cantidadDe(producto._id)}
          alCambiarCantidad={alCambiarCantidad}
          maxUnidades={maxUnidades}
          separada={indice > 0}
        />
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.xs, paddingTop: theme.spacing.xl },
    titulo: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
  });
