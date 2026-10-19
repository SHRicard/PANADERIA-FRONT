import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Cookie } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Segmentado, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { FilaRanking } from '../components/FilaRanking';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { TarjetaFilas } from '../components/TarjetaFilas';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useGustosMasVendidos } from '../hooks/useGustosMasVendidos';
import type { Periodo } from '../rangos';
import {
  detalleSegunOrden,
  enumerar,
  etiquetaDelPeriodo,
  OPCIONES_ORDEN,
  textoSinDatos,
  textoTotales,
  valorSegunOrden,
} from '../textos';
import type { OrdenProductos } from '../types';

// Más → Métricas → Gustos: qué gustos se venden más. El título lo pone el header del Stack
export function GustosMasVendidosScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [orden, setOrden] = useState<OrdenProductos>('unidades');
  const gustos = useGustosMasVendidos(periodo, orden);
  const refresco = useRefrescar(gustos.refrescar);

  return (
    <PantallaMetrica
      descripcion="Qué gustos se venden más. Un pedido con medialunas y pan dulce suma una vez en «Dulce»."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={gustos}
      refresco={refresco}
      vacio={gustos.vendidos.length === 0}
      iconoVacio={Cookie}
      tituloVacio={textoSinDatos(periodo, 'ventas')}
      detalleVacio="Cada pedido que te hacen cuenta como venta, salvo que se cancele."
    >
      <TarjetaResumen
        etiqueta={etiquetaDelPeriodo('Vendido', periodo)}
        valor={formatearPrecio(gustos.totalImporte)}
        detalle={textoTotales(gustos.totalPedidos, gustos.totalUnidades)}
      />

      <View style={styles.seccion}>
        <Text variant="subtitle">Ranking</Text>
        <Segmentado opciones={OPCIONES_ORDEN} valor={orden} alCambiar={setOrden} accessibilityLabel="Ordenar por" />

        <TarjetaFilas>
          {gustos.vendidos.map((gusto, indice) => (
            <FilaRanking
              key={gusto.gusto}
              puesto={indice + 1}
              titulo={gusto.gusto}
              valor={valorSegunOrden(gusto, orden)}
              porcentaje={gustos.porcentaje(gusto)}
              detalle={detalleSegunOrden(gusto, orden)}
            />
          ))}
        </TarjetaFilas>

        {gustos.sinVentas.length > 0 && (
          <Text variant="caption" color="textMuted">
            Sin ventas en el período: {enumerar(gustos.sinVentas)}.
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
