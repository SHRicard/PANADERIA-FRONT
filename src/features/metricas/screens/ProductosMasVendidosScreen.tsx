import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Button, Segmentado, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { FilaRanking } from '../components/FilaRanking';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { TarjetaFilas } from '../components/TarjetaFilas';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useProductosMasVendidos } from '../hooks/useProductosMasVendidos';
import type { Periodo } from '../rangos';
import {
  detalleSegunOrden,
  etiquetaDelPeriodo,
  OPCIONES_ORDEN,
  textoSinDatos,
  textoTotales,
  TODOS_LOS_PRODUCTOS,
  TOP_PRODUCTOS,
  valorSegunOrden,
} from '../textos';
import type { OrdenProductos } from '../types';

// Más → Métricas → Más vendidos: lo vendido en el período y el ranking de productos. El título lo pone el header del Stack
export function ProductosMasVendidosScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [orden, setOrden] = useState<OrdenProductos>('unidades');
  const [verTodos, setVerTodos] = useState(false);
  const ranking = useProductosMasVendidos(periodo, orden, verTodos ? TODOS_LOS_PRODUCTOS : TOP_PRODUCTOS);
  const refresco = useRefrescar(ranking.refrescar);

  return (
    <PantallaMetrica
      descripcion="Lo que más sale. Cuenta los pedidos del período, el día en que los hicieron: si uno se cancela, deja de sumar."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={ranking}
      refresco={refresco}
      vacio={ranking.totalProductos === 0}
      iconoVacio={Trophy}
      tituloVacio={textoSinDatos(periodo, 'ventas')}
      detalleVacio="Cada pedido que te hacen cuenta como venta, salvo que se cancele."
    >
      <TarjetaResumen
        etiqueta={etiquetaDelPeriodo('Vendido', periodo)}
        valor={formatearPrecio(ranking.totalImporte)}
        detalle={textoTotales(ranking.totalPedidos, ranking.totalUnidades, ranking.totalProductos)}
      />

      <View style={styles.seccion}>
        <Text variant="subtitle">Ranking</Text>
        <Segmentado opciones={OPCIONES_ORDEN} valor={orden} alCambiar={setOrden} accessibilityLabel="Ordenar por" />

        <TarjetaFilas>
          {ranking.productos.map((producto, indice) => (
            <FilaRanking
              key={producto.nombre}
              puesto={indice + 1}
              titulo={nombreParaMostrar(producto.nombre)}
              valor={valorSegunOrden(producto, orden)}
              porcentaje={ranking.porcentaje(producto)}
              detalle={`${producto.categoria} · ${detalleSegunOrden(producto, orden)}`}
            />
          ))}
        </TarjetaFilas>

        {ranking.totalProductos > TOP_PRODUCTOS && (
          <Button
            variant="secondary"
            label={verTodos ? `Ver solo los ${TOP_PRODUCTOS} primeros` : `Ver los ${ranking.totalProductos} productos`}
            onPress={() => setVerTodos(!verTodos)}
          />
        )}
        {verTodos && ranking.totalProductos > TODOS_LOS_PRODUCTOS && (
          <Text variant="caption" color="textMuted">
            Se ven los {TODOS_LOS_PRODUCTOS} que más se venden.
          </Text>
        )}
      </View>
    </PantallaMetrica>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.md },
  });
