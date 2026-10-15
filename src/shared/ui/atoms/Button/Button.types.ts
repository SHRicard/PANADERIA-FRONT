import type { LucideIcon } from 'lucide-react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Ícono a la izquierda del label */
  icon?: LucideIcon;
  disabled?: boolean;
  /** Muestra un spinner y bloquea el botón mientras dura una acción */
  loading?: boolean;
  /** Ocupa todo el ancho disponible */
  fullWidth?: boolean;
  /** Texto que lee el lector de pantalla. Por defecto, `label` */
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
