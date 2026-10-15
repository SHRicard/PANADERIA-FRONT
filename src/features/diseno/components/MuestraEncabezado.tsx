import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { Croissant, Plus } from 'lucide-react-native';
import type { AccionEncabezado, EncabezadoProps } from '@/features/navegacion';
import { Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface MuestraEncabezadoProps {
  Encabezado: ComponentType<EncabezadoProps>;
  BarraChica: ComponentType<EncabezadoProps>;
}

// Como en Productos: con la acción «Nuevo», que acá no hace nada
const ACCION: AccionEncabezado = { label: 'Nuevo', icon: Plus, onPress: () => {}, accessibilityLabel: 'Nuevo producto' };
const PRODUCTOS: EncabezadoProps = {
  titulo: 'Productos',
  subtitulo: 'Lo que ven tus clientes en el catálogo',
  icono: Croissant,
  accion: ACCION,
};

/** Un estilo de encabezado tal como se ve arriba de una pestaña, y la barra chica que queda al bajar */
export function MuestraEncabezado({ Encabezado, BarraChica }: MuestraEncabezadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.muestra}>
      <View style={[styles.marco, styles.marcoGrande]}>
        <Encabezado {...PRODUCTOS} />
      </View>
      <Text variant="caption" color="textMuted">
        Al bajar
      </Text>
      <View style={styles.marco}>
        <BarraChica {...PRODUCTOS} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    muestra: { gap: theme.spacing.sm },
    marco: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    marcoGrande: { padding: theme.spacing.lg },
  });
