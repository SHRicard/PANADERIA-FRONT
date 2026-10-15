import type { LucideIcon } from 'lucide-react-native';

/** La acción principal de un apartado, al lado del título (ej.: «Nuevo» en Productos) */
export interface AccionEncabezado {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  /** Texto que lee el lector de pantalla. Por defecto, `label` */
  accessibilityLabel?: string;
}

/** Lo que recibe cada estilo de encabezado, el grande y la barra chica que aparece al bajar */
export interface EncabezadoProps {
  titulo: string;
  /** Qué es el apartado. Revista y Carta no lo muestran */
  subtitulo: string;
  /** El ícono de la pestaña. Solo lo muestra «Con ícono» */
  icono: LucideIcon;
  accion?: AccionEncabezado;
}
