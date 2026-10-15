import { Moon, Sun, SunMoon } from 'lucide-react-native';
import type { PreferenciaTema } from '@/theme';
import { Segmentado, type OpcionSegmentado } from '../Segmentado';

const OPCIONES: OpcionSegmentado<PreferenciaTema>[] = [
  { valor: 'sistema', label: 'Sistema', icono: SunMoon },
  { valor: 'claro', label: 'Claro', icono: Sun },
  { valor: 'oscuro', label: 'Oscuro', icono: Moon },
];

export interface SelectorTemaProps {
  valor: PreferenciaTema;
  alCambiar: (preferencia: PreferenciaTema) => void;
}

/** Sistema, claro u oscuro. La preferencia la pasa quien lo usa (useThemeMode) */
export function SelectorTema({ valor, alCambiar }: SelectorTemaProps) {
  return <Segmentado opciones={OPCIONES} valor={valor} alCambiar={alCambiar} accessibilityLabel="Tema" />;
}
