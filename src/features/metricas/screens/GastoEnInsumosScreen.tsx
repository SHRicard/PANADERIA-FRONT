import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Wheat } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { FilaRanking } from '../components/FilaRanking';
import { MiniPrecios } from '../components/MiniPrecios';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { TarjetaFilas } from '../components/TarjetaFilas';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useGastoEnInsumos } from '../hooks/useGastoEnInsumos';
import type { Periodo } from '../rangos';
import {
  colorVariacion,
  enumerar,
  etiquetaDelPeriodo,
  parteDe,
  precioComparable,
  textoAumentos,
  textoCompra,
  textoCambioDePrecio,
  textoCompras,
  textoSinDatos,
  textoVariacion,
  valoresComparables,
} from '../textos';
import type { GastoInsumo } from '../types';

/** Cuántos insumos se nombran en el aviso de los que subieron */
const AUMENTOS_EN_EL_AVISO = 3;

// Más → Métricas → Gasto en insumos: en qué se gastó más y cuánto aumentó cada uno. El título lo pone el header del Stack
export function GastoEnInsumosScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const gasto = useGastoEnInsumos(periodo);
  const refresco = useRefrescar(gasto.refrescar);

  return (
    <PantallaMetrica
      descripcion="Lo que compraste para producir, por el día de cada compra, y cuánto aumentó cada insumo desde la compra anterior."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={gasto}
      refresco={refresco}
      vacio={gasto.insumos.length === 0}
      iconoVacio={Wheat}
      tituloVacio={textoSinDatos(periodo, 'compras de insumos')}
      detalleVacio="Cargá cada compra en Más → Insumos: así ves cuánto gastás y cuánto aumenta cada cosa."
    >
      <TarjetaResumen
        etiqueta={etiquetaDelPeriodo('Gastado', periodo)}
        valor={formatearPrecio(gasto.totalGastado)}
        detalle={`${textoCompras(gasto.totalCompras)} de ${gasto.insumos.length} ${gasto.insumos.length === 1 ? 'insumo' : 'insumos'}`}
      />

      {gasto.aumentos.length > 0 && (
        <Alert
          tone="warning"
          title={textoAumentos(gasto.aumentos.length)}
          message={`${enumerar(
            gasto.aumentos.slice(0, AUMENTOS_EN_EL_AVISO).map((insumo) => `${insumo.nombre} ${textoVariacion(insumo.variacion ?? 0)}`)
          )}${gasto.aumentos.length > AUMENTOS_EN_EL_AVISO ? ' y otros' : ''}. Revisá los precios de lo que hacés con ellos.`}
        />
      )}

      <View style={styles.seccion}>
        <Text variant="subtitle">En qué gastaste más</Text>
        <TarjetaFilas>
          {gasto.insumos.map((insumo, indice) => (
            <FilaRanking
              key={insumo.insumoId}
              puesto={indice + 1}
              titulo={insumo.nombre}
              valor={formatearPrecio(insumo.gastado)}
              porcentaje={parteDe(insumo.gastado, gasto.totalGastado)}
              detalle={`${textoCompras(insumo.compras)} · la última, ${textoCompra(insumo.ultimaCompra)}`}
              extra={<CambioDePrecio insumo={insumo} />}
              textoExtra={textoCambioDePrecio(insumo)}
              onPress={() => gasto.abrir(insumo)}
            />
          ))}
        </TarjetaFilas>
        <Text variant="caption" color="textMuted">
          Tocá un insumo para ver todo su historial de precios.
        </Text>
      </View>
    </PantallaMetrica>
  );
}

/**
 * Cómo fue el precio: las compras con su barra y cuánto subió o bajó la última respecto de la anterior. Si dicen
 * cuánto vino, por kilo, litro o unidad (la misma cuenta que la variación del back)
 */
function CambioDePrecio({ insumo }: { insumo: GastoInsumo }) {
  const styles = useStyles(createStyles);
  if (!insumo.compraAnterior) {
    return (
      <Text variant="caption" color="textMuted">
        Primera compra: todavía no hay con qué comparar
      </Text>
    );
  }
  if (insumo.variacion === null) {
    return (
      <Text variant="caption" color="textMuted">
        No se compara con la anterior: no dicen cuánto vino en la misma unidad. Completalo en el insumo, con «Corregir datos».
      </Text>
    );
  }
  // Con una sola compra en el período, la anterior es de antes: se suma para ver de dónde viene
  const compras = insumo.precios.length > 1 ? insumo.precios : [insumo.compraAnterior, ...insumo.precios];
  const valores = valoresComparables(compras);

  return (
    <View style={styles.cambio}>
      {valores && <MiniPrecios precios={valores} />}
      <Text variant="caption" color="textMuted" style={styles.antes}>
        Antes {precioComparable(insumo.compraAnterior)}, ahora {precioComparable(insumo.ultimaCompra)}
      </Text>
      <Text variant="label" color={colorVariacion(insumo.variacion)}>
        {textoVariacion(insumo.variacion)}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.md },
    cambio: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
    antes: { flex: 1 },
  });
