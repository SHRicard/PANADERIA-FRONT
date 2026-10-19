import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { ESTADO, MARCA_MANUAL, type EstadoPedido } from '@/features/pedidos';
import { useRefrescar } from '@/shared/hooks';
import { Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { BarraPartes } from '../components/BarraPartes';
import { FilaRanking } from '../components/FilaRanking';
import { GraficoDias } from '../components/GraficoDias';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { Tarjeta } from '../components/Tarjeta';
import { TarjetaFilas } from '../components/TarjetaFilas';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useResumenPedidos } from '../hooks/useResumenPedidos';
import type { Periodo } from '../rangos';
import { etiquetaDelPeriodo, formatearNumero, parteDe, textoCancelados, textoPedidos, textoSinDatos } from '../textos';

/** En el orden en que avanza un pedido */
const ESTADOS = Object.keys(ESTADO) as EstadoPedido[];

// Más → Métricas → Pedidos: cuántos, en qué estado, de dónde llegan, el ticket promedio y qué días. El título lo pone el header
export function ResumenPedidosScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const pedidos = useResumenPedidos(periodo);
  const refresco = useRefrescar(pedidos.refrescar);
  const resumen = pedidos.resumen;

  return (
    <PantallaMetrica
      descripcion="Los pedidos que te hicieron en el período, por el día en que los hicieron, con el estado que tienen hoy."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={pedidos}
      refresco={refresco}
      vacio={!resumen || resumen.totalPedidos === 0}
      iconoVacio={ClipboardList}
      tituloVacio={textoSinDatos(periodo, 'pedidos')}
      detalleVacio="Acá vas a ver cuántos pedidos te hacen, de dónde llegan y qué días."
    >
      {resumen && (
        <>
          <TarjetaResumen
            etiqueta={etiquetaDelPeriodo('Pedidos', periodo)}
            valor={formatearNumero(resumen.totalPedidos)}
            detalle={
              resumen.ticketPromedio > 0
                ? `Ticket promedio: ${formatearPrecio(resumen.ticketPromedio)} por pedido, sin contar los cancelados`
                : undefined
            }
          />

          <View style={styles.seccion}>
            <Text variant="subtitle">En qué estado están</Text>
            <TarjetaFilas>
              {ESTADOS.map((estado) => (
                <FilaRanking
                  key={estado}
                  titulo={ESTADO[estado].label}
                  valor={formatearNumero(resumen.porEstado[estado])}
                  porcentaje={parteDe(resumen.porEstado[estado], resumen.totalPedidos)}
                />
              ))}
            </TarjetaFilas>
            <Text variant="caption" color="textMuted">
              {textoCancelados(resumen.porEstado.cancelado, resumen.totalPedidos, resumen.porcentajeCancelados)}
            </Text>
          </View>

          <View style={styles.seccion}>
            <Text variant="subtitle">De dónde llegan</Text>
            <Tarjeta>
              <BarraPartes
                partes={[
                  { label: 'Desde la web', valor: resumen.porOrigen.web },
                  { label: MARCA_MANUAL, valor: resumen.porOrigen.manual },
                ]}
                accessibilityLabel="Pedidos según de dónde llegan"
              />
            </Tarjeta>
          </View>

          <View style={styles.seccion}>
            <Text variant="subtitle">Qué días te piden más</Text>
            <Tarjeta>
              <GraficoDias dias={resumen.porDiaDeLaSemana} />
            </Tarjeta>
            {pedidos.diaConMasPedidos && (
              <Text variant="caption" color="textMuted">
                El día con más pedidos: {pedidos.diaConMasPedidos.dia}, con {textoPedidos(pedidos.diaConMasPedidos.pedidos)}.
              </Text>
            )}
          </View>
        </>
      )}
    </PantallaMetrica>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.md },
  });
