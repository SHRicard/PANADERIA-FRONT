import { memo } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme, type ColorToken, type Theme } from '@/theme';

export interface IconProps {
  /** Ícono de Lucide importado por nombre: `import { Plus } from 'lucide-react-native'` */
  icon: LucideIcon;
  size?: keyof Theme['iconSize'];
  color?: ColorToken;
  /** Solo si el ícono comunica algo por sí solo. Sin label es decorativo y el lector lo saltea */
  accessibilityLabel?: string;
}

function IconComponent({ icon: Glifo, size = 'md', color = 'text', accessibilityLabel }: IconProps) {
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
      <Glifo size={theme.iconSize[size]} color={theme.colors[color]} strokeWidth={2} />
    </View>
  );
}

export const Icon = memo(IconComponent);
