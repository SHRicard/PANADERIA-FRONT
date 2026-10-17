import { Pressable, StyleSheet, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useCarrito } from '../hooks/useCarrito';
import { useEnNavegador } from '../hooks/useEnNavegador';

const productos = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/** El clásico botón del carrito, arriba a la derecha: la bolsa con cuántos productos lleva. Abre «Tu pedido» */
export function BotonCarrito() {
  const styles = useStyles(createStyles);
  const carrito = useCarrito();
  // La web se prerenderiza sin carrito: el número aparece recién en el navegador
  const unidades = useEnNavegador() ? carrito.unidades : 0;
  const lleno = unidades > 0;

  return (
    <Pressable
      onPress={carrito.abrirPedido}
      accessibilityRole="button"
      accessibilityLabel={lleno ? `Ver tu pedido: ${productos(unidades)}` : 'Ver tu pedido'}
      style={({ pressed }) => [styles.boton, lleno && styles.botonLleno, pressed && styles.presionado]}
    >
      <Icon icon={ShoppingBag} color={lleno ? 'primary' : 'text'} />
      {lleno && (
        <View style={styles.insignia}>
          <Text variant="caption" color="onPrimary" style={styles.numero}>
            {unidades > 99 ? '99+' : unidades}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    boton: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    // Con productos se marca, como el botón de filtros cuando hay alguno puesto
    botonLleno: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
    presionado: { opacity: theme.opacity.pressed },
    insignia: {
      position: 'absolute',
      top: -(theme.spacing.xs + theme.spacing.xxs),
      right: -(theme.spacing.xs + theme.spacing.xxs),
      minWidth: theme.sizes.insignia,
      height: theme.sizes.insignia,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.full,
      // El borde del color del fondo la despega del botón
      borderWidth: 2,
      borderColor: theme.colors.background,
      backgroundColor: theme.colors.primary,
    },
    numero: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
  });
