import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ClipboardList, Croissant, LayoutDashboard, Menu, type LucideIcon } from 'lucide-react-native';

/** Nombre del archivo de cada ruta en src/app/(admin)/(tabs)/ */
export type RutaPestana = 'dashboard' | 'productos' | 'pedidos' | 'mas';

export interface PestanaAdmin {
  ruta: RutaPestana;
  titulo: string;
  /** Qué es el apartado. Lo muestran los encabezados que llevan subtítulo */
  subtitulo: string;
  icono: LucideIcon;
}

/** Las pestañas del admin, en el orden de la barra. La primera es la que abre después del login */
export const PESTANAS_ADMIN: readonly PestanaAdmin[] = [
  { ruta: 'dashboard', titulo: 'Dashboard', subtitulo: 'El resumen del día en la panadería', icono: LayoutDashboard },
  { ruta: 'productos', titulo: 'Productos', subtitulo: 'Lo que ven tus clientes en el catálogo', icono: Croissant },
  { ruta: 'pedidos', titulo: 'Pedidos', subtitulo: 'Lo que te encargan tus clientes', icono: ClipboardList },
  { ruta: 'mas', titulo: 'Más', subtitulo: 'Preferencias y cuenta', icono: Menu },
];

/** Una pestaña ya lista para dibujar */
export interface Pestana {
  clave: string;
  titulo: string;
  icono: LucideIcon;
  activa: boolean;
  alPresionar: () => void;
}

/** Lo que recibe cada barra. No sabe nada del navegador: así también se puede mostrar en Diseño del sistema */
export interface BarraProps {
  pestanas: Pestana[];
  /** Lo que ocupa la barra del sistema abajo (los botones de Android) */
  margenInferior: number;
}

/** Las pestañas a partir de lo que le pasa el navegador a la barra */
export function armarPestanas({ state, descriptors, navigation }: BottomTabBarProps): Pestana[] {
  return state.routes.map((route, indice) => {
    const activa = state.index === indice;
    const pestana = PESTANAS_ADMIN.find(({ ruta }) => ruta === route.name);

    return {
      clave: route.key,
      titulo: descriptors[route.key].options.title ?? route.name,
      // Una ruta nueva en (tabs) sin sumarla a PESTANAS_ADMIN se ve igual, con un ícono genérico
      icono: pestana?.icono ?? Menu,
      activa,
      // Igual que la barra de fábrica: avisa con tabPress y solo navega si nadie lo frenó
      alPresionar: () => {
        const evento = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!activa && !evento.defaultPrevented) navigation.navigate(route.name, route.params);
      },
    };
  });
}
