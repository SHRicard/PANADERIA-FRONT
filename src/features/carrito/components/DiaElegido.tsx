import { StyleSheet, View } from 'react-native';
import { CalendarCheck } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

export interface DiaElegidoProps {
  /** «Para el sábado 21 de noviembre» */
  texto: string;
  /**
   * El de las fiestas: relleno suave y con las puntas redondas, como su botón. Si no, con borde y las puntas del
   * `Button`: en Carta y Vidriera el relleno suave es casi del color del fondo y se perdía
   */
  fiestas?: boolean;
}

/** El día que eligió, arriba de «Confirmar pedido»: para que lo vea de un vistazo antes de tocar */
export function DiaElegido({ texto, fiestas = false }: DiaElegidoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.badge, fiestas ? styles.fiestas : styles.normal]} accessibilityRole="text" accessibilityLiveRegion="polite">
      <Icon icon={CalendarCheck} size="sm" color="primary" />
      <Text variant="bodyStrong" color="primary" align="center" style={styles.texto}>
        {texto}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Del ancho y la forma de «Confirmar pedido», que va justo abajo: se leen como un solo bloque
    badge: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
    },
    normal: {
      borderRadius: theme.radius.md,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    fiestas: {
      borderRadius: theme.radius.full,
      borderColor: 'transparent',
      backgroundColor: theme.colors.primarySoft,
    },
    texto: { flexShrink: 1 },
  });
