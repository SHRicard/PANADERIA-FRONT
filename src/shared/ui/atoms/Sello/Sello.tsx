import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface SelloProps {
  /** El texto que eligió el dueño ("Promo lanzamiento"). Sale en mayúsculas */
  texto: string;
  /** Derecho, sin inclinar (el admin). Por defecto va apenas inclinado, como un sello de goma */
  recto?: boolean;
}

/**
 * Un texto destacado como un sello: dorado, con un borde punteado adentro, como una estampilla, y apenas
 * inclinado (o recto). Para la etiqueta de un producto
 */
function SelloComponent({ texto, recto = false }: SelloProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.sello, !recto && styles.inclinado]}>
      <View style={styles.borde}>
        <Icon icon={Sparkles} size="xs" color="onAccent" />
        {/* Hasta dos renglones: en una tarjeta angosta (la vidriera en el celular) entra entero */}
        <Text variant="overline" color="onAccent" numberOfLines={2} style={styles.texto}>
          {texto}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    sello: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.accent,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
    },
    // Inclinado como un sello de goma; no tanto como para que cueste leerlo
    inclinado: { transform: [{ rotate: '-2deg' }] },
    borde: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.sm - theme.spacing.xxs,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.onAccent,
    },
    texto: { flexShrink: 1 },
  });

export const Sello = memo(SelloComponent);
