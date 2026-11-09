import { StyleSheet, View } from 'react-native';
import { Search } from 'lucide-react-native';
import type { Producto } from '@/features/productos';
import { Alert, Button, Cargando, Input, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { BuscadorProductos as Buscador } from '../hooks/useBuscadorProductos';
import { FilaProductoManual } from './FilaProductoManual';

interface BuscadorProductosProps {
  buscador: Buscador;
  /** Los que ya están arriba, en el pedido: no se repiten en los resultados */
  ocultos: ReadonlySet<string>;
  max: number;
  /** Tocó el «+» de un resultado: el producto entra con la cantidad elegida */
  alCambiar: (producto: Producto, cantidad: number) => void;
}

/** El buscador para sumar productos a un pedido (manual o al editarlo): el campo, los resultados y «Ver más» */
export function BuscadorProductos({ buscador, ocultos, max, alCambiar }: BuscadorProductosProps) {
  const styles = useStyles(createStyles);

  return (
    <>
      <Input
        icon={Search}
        value={buscador.texto}
        onChangeText={buscador.setTexto}
        placeholder="Buscar un producto"
        accessibilityLabel="Buscar un producto"
        autoCapitalize="none"
        returnKeyType="search"
      />
      {buscador.cargandoProductos && <Cargando mensaje="Cargando productos…" style={styles.cargando} />}
      {buscador.errorCargaProductos && (
        <View style={styles.error}>
          <Alert tone="danger" message={buscador.errorCargaProductos} />
          <Button variant="secondary" label="Reintentar" onPress={buscador.reintentarProductos} />
        </View>
      )}
      {!buscador.cargandoProductos && !buscador.errorCargaProductos && buscador.productos.length === 0 && (
        <Text color="textMuted">Ningún producto coincide con «{buscador.texto}».</Text>
      )}
      <View>
        {buscador.productos
          .filter((producto) => !ocultos.has(producto._id))
          .map((producto) => (
            <FilaProductoManual
              key={producto._id}
              producto={producto}
              cantidad={0}
              max={max}
              alCambiar={(cantidad) => alCambiar(producto, cantidad)}
            />
          ))}
      </View>
      {buscador.cargandoMasProductos ? (
        <Cargando tamano="chico" mensaje="Cargando más productos" />
      ) : buscador.hayMasProductos ? (
        <Button variant="ghost" label="Ver más productos" onPress={buscador.cargarMasProductos} fullWidth />
      ) : null}
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.lg },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
