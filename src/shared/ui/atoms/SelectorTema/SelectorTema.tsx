import { Moon, Sun } from 'lucide-react-native';
import type { PreferenciaTema } from '@/theme';
import { Segmentado, type OpcionSegmentado } from '../Segmentado';

const OPCIONES: OpcionSegmentado<PreferenciaTema>[] = [
  { valor: 'claro', label: 'Claro', icono: Sun },
  { valor: 'oscuro', label: 'Oscuro', icono: Moon },
];

export interface SelectorTemaProps {
  valor: PreferenciaTema;
  alCambiar: (preferencia: PreferenciaTema) => void;
}

/** Claro u oscuro. La preferencia la pasa quien lo usa */
export function SelectorTema({ valor, alCambiar }: SelectorTemaProps) {
  return <Segmentado opciones={OPCIONES} valor={valor} alCambiar={alCambiar} accessibilityLabel="Tema" />;
}
