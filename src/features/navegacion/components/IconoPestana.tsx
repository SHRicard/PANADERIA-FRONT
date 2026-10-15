import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Icon } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface IconoPestanaProps {
  icono: LucideIcon;
  /** `grande` en el encabezado, `chico` en la barra que aparece al bajar */
  tamano: 'grande' | 'chico';
}

/** El ícono de la pestaña en un círculo suave del color de la marca */
export function IconoPestana({ icono, tamano }: IconoPestanaProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={[styles.circulo, tamano === 'grande' ? styles.grande : styles.chico]}>
      <Icon icon={icono} size={tamano === 'grande' ? 'lg' : 'md'} color="primary" />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    circulo: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },
    grande: { width: theme.sizes.iconoPestana, height: theme.sizes.iconoPestana },
    chico: { width: theme.sizes.iconoPestanaChico, height: theme.sizes.iconoPestanaChico },
  });
