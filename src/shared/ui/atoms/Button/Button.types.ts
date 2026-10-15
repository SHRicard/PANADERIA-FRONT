import type { LucideIcon } from 'lucide-react-native';

/** `danger`: acciones que borran algo y no se pueden deshacer */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** `sm`: una píldora más chica, para acciones al lado de un título (ej.: «Nuevo» en Productos) */
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
