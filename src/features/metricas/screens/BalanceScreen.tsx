import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Scale } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { GraficoBalance } from '../components/GraficoBalance';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { Tarjeta } from '../components/Tarjeta';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useBalance } from '../hooks/useBalance';
import type { Periodo } from '../rangos';
import { etiquetaDelPeriodo, textoCompras, textoPedidos, textoSinDatos, TITULO_SERIE, UNIDAD_SERIE } from '../textos';

// Más → Métricas → Balance: lo que entró, lo que salió y lo que quedó, con el gráfico por período. El título lo pone el header
export function BalanceScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const metrica = useBalance(periodo);
  const refresco = useRefrescar(metrica.refrescar);
  const balance = metrica.balance;

  return (
    <PantallaMetrica
      descripcion="Lo que entró por tus pedidos (el día en que te los hicieron, salvo los cancelados) menos lo que gastaste en insumos (el día de cada compra)."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={metrica}
      refresco={refresco}
      vacio={!balance || (balance.pedidos === 0 && balance.compras === 0)}
      iconoVacio={Scale}
      tituloVacio={textoSinDatos(periodo, 'movimientos')}
      detalleVacio="Acá vas a ver lo que entra por tus pedidos, lo que sale en insumos y lo que te queda."
    >
      {balance && (
        <>
          <TarjetaResumen
            etiqueta={etiquetaDelPeriodo('Te quedó', periodo)}
            valor={formatearPrecio(balance.ganancia)}
            colorValor={balance.ganancia < 0 ? 'danger' : 'text'}
          >
            <View style={styles.dos}>
              <View style={styles.mitad}>
                <Text variant="caption" color="textMuted">
                  Entró
                </Text>
                <Text variant="subtitle">{formatearPrecio(balance.ingresos)}</Text>
                <Text variant="caption" color="textMuted">
                  {textoPedidos(balance.pedidos)}
                </Text>
              </View>
              <View style={styles.mitad}>
                <Text variant="caption" color="textMuted">
                  Salió
                </Text>
                <Text variant="subtitle">{formatearPrecio(balance.gastos)}</Text>
                <Text variant="caption" color="textMuted">
                  {textoCompras(balance.compras)} de insumos
                </Text>
              </View>
            </View>
          </TarjetaResumen>

          {balance.ganancia < 0 && (
            <Text variant="caption" color="textMuted">
              Salió más de lo que entró. Pasa, por ejemplo, el mes en que comprás mucha harina: lo que sobra para el mes que
              viene no se descuenta.
            </Text>
          )}

          {balance.porCobrar > 0 && (
            <Alert
              tone="info"
              title={`Te falta cobrar ${formatearPrecio(balance.porCobrar)}`}
              message="De los pedidos que todavía no entregaste, lo que queda después de la seña. Ya está sumado en lo que entró."
            />
          )}

          {balance.serie.length > 0 && (
            <View style={styles.seccion}>
              <Text variant="subtitle">{TITULO_SERIE[balance.agrupar]}</Text>
              <Tarjeta>
                {/* Con otro período arranca de nuevo en el último */}
                <GraficoBalance key={periodo} serie={balance.serie} agrupar={balance.agrupar} />
              </Tarjeta>
              <Text variant="caption" color="textMuted">
                Tocá o deslizá el dedo por el gráfico para ver cada {UNIDAD_SERIE[balance.agrupar]}.
              </Text>
            </View>
          )}
        </>
      )}
    </PantallaMetrica>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    seccion: { gap: theme.spacing.md },
    dos: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    mitad: { flex: 1, gap: theme.spacing.xxs },
  });
