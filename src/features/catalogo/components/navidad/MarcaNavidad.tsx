import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { NombreAssetNavidad } from '@/features/catalogo/assetsNavidad';
import { Vivo } from './adornos';
import { Ilustracion } from './Ilustracion';
import { RegaloCarrito } from './RegaloCarrito';

interface MarcaNavidadProps {
  /** Qué logo de Navidad: el verde se lee sobre claro y sobre rojo; el crema, sobre un fondo oscuro */
  logo: 'logoVerde' | 'logoCrema';
  /** Encima de la banda de color (el cielo): las letras van del color de encima */
  sobreDestacado?: boolean;
  /** El regalo que hace de carrito */
  regalo?: NombreAssetNavidad;
  /** Que el logo respire (crece apenas y vuelve) */
  vivo?: boolean;
}

/**
 * La barra de arriba del catálogo de Navidad: el logo de Navidad (que respira, si `vivo`), «Dama Blanca · Horneados» y
 * el regalo con el pedido, que salta al sumar un producto
 */
export function MarcaNavidad({ logo, sobreDestacado = false, regalo = 'regaloRojo', vivo = false }: MarcaNavidadProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.barra}>
      {vivo ? (
        <Vivo como="latir">
          <Ilustracion nombre={logo} alto={theme.sizes.logoNavidad} />
        </Vivo>
      ) : (
        <Ilustracion nombre={logo} alto={theme.sizes.logoNavidad} />
      )}
      <View style={styles.marca}>
        <Text variant="title" color={sobreDestacado ? 'onDestacado' : 'text'}>
          Dama Blanca
        </Text>
        <Text variant="overline" color={sobreDestacado ? 'onDestacado' : 'textMuted'}>
          Horneados
        </Text>
      </View>
      <RegaloCarrito nombre={regalo} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    marca: { flex: 1 },
  });
