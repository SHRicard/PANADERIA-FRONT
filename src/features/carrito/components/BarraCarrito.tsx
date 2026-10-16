import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useBreakpoint } from '@/shared/hooks';
import { Button, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { useCarrito } from '../hooks/useCarrito';
import { useCotizacion } from '../hooks/useCotizacion';

const unidades = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * Abajo del catálogo y del detalle, mientras el carrito tenga algo: cuántos productos, el total con los
 * precios de hoy y «Ver pedido»
 */
export function BarraCarrito() {
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';
  const carrito = useCarrito();
  const { cotizacion } = useCotizacion(carrito.items);
  // La web se prerenderiza sin carrito (no hay localStorage en el servidor): aparece recién en el navegador
  const [montada, setMontada] = useState(false);
  useEffect(() => setMontada(true), []);

  if (!montada || carrito.unidades === 0) return null;

  return (
    <View style={styles.barra}>
      <View style={[styles.contenido, enCompu && styles.contenidoCompu]}>
        <View style={styles.textos}>
          <Text variant="label">Tu pedido</Text>
          <Text variant="caption" color="textMuted">
            {unidades(carrito.unidades)}
            {cotizacion ? ` · ${formatearPrecio(cotizacion.total)}` : ''}
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
  });
