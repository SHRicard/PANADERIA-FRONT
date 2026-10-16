import { memo } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme, type ColorToken, type Theme } from '@/theme';

export interface IconProps {
  /** Ícono de Lucide importado por nombre: `import { Plus } from 'lucide-react-native'` */
  icon: LucideIcon;
  size?: keyof Theme['iconSize'];
  color?: ColorToken;
  /**
   * Rellena el dibujo con el mismo color, translúcido para no tapar los trazos de adentro (la pestaña activa
   * de la barra). Con 'lleno', macizo (las estrellas de un puntaje). Solo se nota en íconos con formas cerradas
   */
  relleno?: boolean | 'lleno';
  trazo?: keyof Theme['iconStroke'];
  /** Solo si el ícono comunica algo por sí solo. Sin label es decorativo y el lector lo saltea */
  accessibilityLabel?: string;
}

function IconComponent({
  icon: Glifo,
  size = 'md',
  color = 'text',
  relleno = false,
  trazo = 'normal',
  accessibilityLabel,
}: IconProps) {
  const theme = useTheme();
  const decorativo = !accessibilityLabel;

  // La accesibilidad va en un View: en la web, react-native-svg pasa las props tal cual al <svg>
  // y las de React Native (accessible, importantForAccessibility…) no existen en HTML
  return (
    <View
      accessible={!decorativo}
      role={decorativo ? undefined : 'img'}
      aria-label={accessibilityLabel}
      aria-hidden={decorativo}
    >
      <Glifo
        size={theme.iconSize[size]}
        color={theme.colors[color]}
        fill={relleno ? theme.colors[color] : 'none'}
        fillOpacity={relleno === true ? theme.opacity.relleno : undefined}
        strokeWidth={theme.iconStroke[trazo]}
      />
    </View>
  );
}

export const Icon = memo(IconComponent);
