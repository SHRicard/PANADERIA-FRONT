import { StyleSheet, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useBreakpoint } from '@/shared/hooks';
import { Button, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { IlustracionNavidad, useEsNavidad, Vivo } from '@/features/catalogo';
import { fondoDegradado, useStyles, useTheme, type Theme } from '@/theme';
import { useCarrito } from '../hooks/useCarrito';
import { useCotizacion } from '../hooks/useCotizacion';
import { useEnNavegador } from '../hooks/useEnNavegador';
import { TEXTOS_PEDIDO_NAVIDAD } from '../textos';

const unidades = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * Abajo del catálogo y del detalle, mientras el carrito tenga algo: cuántos productos, el total con los
 * precios de hoy y «Ver pedido». De Navidad, el regalo dorado que late a la izquierda, «Tu pedido de fiestas» y un filo
 * dorado arriba
 */
export function BarraCarrito() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navidad = useEsNavidad();
  const enCompu = useBreakpoint() === 'compu';
  const carrito = useCarrito();
  const { cotizacion, cotizando } = useCotizacion(carrito.items);
  // La web se prerenderiza sin carrito: aparece recién en el navegador
  const enNavegador = useEnNavegador();

  if (!enNavegador || carrito.unidades === 0) return null;

  return (
    <View style={styles.barra}>
      {navidad && <View aria-hidden style={styles.filo} />}
      <View style={[styles.contenido, enCompu && styles.contenidoCompu]}>
        {navidad && (
          <Vivo como="latir">
            <IlustracionNavidad nombre="regaloDoradoAcebo" alto={theme.sizes.mascota} />
          </Vivo>
        )}
        <View style={styles.textos}>
          <Text variant="label">{navidad ? TEXTOS_PEDIDO_NAVIDAD.barra : 'Tu pedido'}</Text>
          <Text variant="caption" color="textMuted">
            {unidades(carrito.unidades)}
            {/* Mientras cotiza el cambio, el total de antes sería de otros productos: no se muestra uno que no corresponde */}
            {cotizando ? ' · calculando…' : cotizacion ? ` · ${formatearPrecio(cotizacion.total)}` : ''}
          </Text>
        </View>
        <Button label="Ver pedido" icon={ShoppingBag} onPress={carrito.abrirPedido} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: {
      position: 'relative',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 -${theme.spacing.xxs}px ${theme.spacing.md}px ${theme.colors.shadow}`,
    },
    contenido: {
      width: '100%',
      maxWidth: theme.sizes.cartaMax,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    // Alineada con la carta: en la compu, el mismo 80% de la ventana
    contenidoCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    textos: { flex: 1, gap: theme.spacing.xxs },
    // El filo dorado de arriba (Navidad): se apaga hacia los costados
    filo: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: theme.spacing.xxs,
      ...fondoDegradado(`linear-gradient(90deg, transparent 0%, ${theme.colors.accent} 50%, transparent 100%)`),
    },
  });
