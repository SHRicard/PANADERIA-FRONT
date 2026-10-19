import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Users } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { BarraPartes } from '../components/BarraPartes';
import { PantallaMetrica } from '../components/PantallaMetrica';
import { Tarjeta } from '../components/Tarjeta';
import { TarjetaResumen } from '../components/TarjetaResumen';
import { useClientesDelRango } from '../hooks/useClientesDelRango';
import type { Periodo } from '../rangos';
import { etiquetaDelPeriodo, formatearNumero, textoSinDatos } from '../textos';

// Más → Métricas → Clientes: los nuevos y los que vuelven. El título lo pone el header del Stack
export function ClientesScreen() {
  const styles = useStyles(createStyles);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const metrica = useClientesDelRango(periodo);
  const refresco = useRefrescar(metrica.refrescar);
  const clientes = metrica.clientes;

  return (
    <PantallaMetrica
      descripcion="Los que te compraron en el período, sin contar los pedidos cancelados."
      periodo={periodo}
      alCambiarPeriodo={setPeriodo}
      metrica={metrica}
      refresco={refresco}
      vacio={!clientes || clientes.totalClientes === 0}
      iconoVacio={Users}
      tituloVacio={textoSinDatos(periodo, 'clientes')}
      detalleVacio="Acá vas a ver cuántos clientes nuevos tenés y cuántos vuelven a comprarte."
    >
      {clientes && (
        <>
          <TarjetaResumen
            etiqueta={etiquetaDelPeriodo('Clientes', periodo)}
            valor={formatearNumero(clientes.totalClientes)}
            detalle={clientes.totalClientes === 1 ? 'Te compró en el período' : 'Te compraron en el período'}
          />

          <View style={styles.seccion}>
            <Text variant="subtitle">Nuevos y los que vuelven</Text>
            {/* Desde el principio todos son nuevos: no hay un antes con el que comparar */}
            {periodo === 'todo' ? (
              <Text color="textMuted">
                Desde el principio, todos son nuevos: lo que dice si vuelven es cuántos te compraron más de una vez, abajo.
              </Text>
            ) : (
              <>
                <Tarjeta>
                  <BarraPartes
                    partes={[
                      { label: 'Primera compra', valor: clientes.nuevos },
                      { label: 'Volvieron', valor: clientes.recurrentes },
                    ]}
                    accessibilityLabel="Clientes nuevos y los que volvieron"
                  />
                </Tarjeta>
                <Text variant="caption" color="textMuted">
                  Primera compra: nunca te habían comprado antes del período. Volvieron: ya te habían comprado antes.
                </Text>
              </>
            )}
          </View>

          <View style={styles.seccion}>
            <Text variant="subtitle">Cuántas veces te compraron</Text>
            <Tarjeta>
              <BarraPartes
                partes={[
                  { label: 'Dos veces o más', valor: clientes.conVariosPedidos },
                  { label: 'Una vez', valor: clientes.totalClientes - clientes.conVariosPedidos },
                ]}
                accessibilityLabel="Clientes según cuántas veces compraron en el período"
              />
            </Tarjeta>
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
