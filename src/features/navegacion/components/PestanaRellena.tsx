import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { Pestana } from '../pestanas';

interface PestanaRellenaProps {
  pestana: Pestana;
  /** La burbuja ya muestra el ícono activo: acá queda invisible ocupando su lugar, así la etiqueta no salta */
  iconoOculto?: boolean;
}

/**
 * Una pestaña de las barras Al piso, Cápsula y Con burbuja. La activa no se marca solo con color: el ícono
 * pasa de línea a relleno, con el trazo más grueso, y la etiqueta va en negrita
 */
export function PestanaRellena({ pestana: { titulo, icono, activa, alPresionar }, iconoOculto = false }: PestanaRellenaProps) {
  const styles = useStyles(createStyles);
  const color = activa ? 'primary' : 'textMuted';

  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="tab"
      accessibilityState={{ selected: activa }}
      accessibilityLabel={titulo}
      style={({ pressed }) => [styles.pestana, pressed && styles.presionada]}
    >
      <View style={iconoOculto && styles.oculto}>
        <Icon icon={icono} size="lg" color={color} relleno={activa} trazo={activa ? 'grueso' : 'fino'} />
      </View>
      <Text variant="caption" color={color} numberOfLines={1} style={activa ? styles.etiquetaActiva : styles.etiqueta}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    pestana: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xxs },
    presionada: { opacity: theme.opacity.pressed },
    oculto: { opacity: 0 },
    etiqueta: { fontFamily: theme.fonts.textoMedio },
    etiquetaActiva: { fontFamily: theme.fonts.textoNegrita },
  });
