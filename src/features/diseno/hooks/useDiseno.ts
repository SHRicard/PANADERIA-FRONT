import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { OpcionSegmentado, OpcionSelect } from '@/shared/ui/atoms';

const DURACION_CARGA_MS = 1500;

type Periodo = 'hoy' | 'semana' | 'mes';

export const PERIODOS: OpcionSegmentado<Periodo>[] = [
  { valor: 'hoy', label: 'Hoy' },
  { valor: 'semana', label: 'Semana' },
  { valor: 'mes', label: 'Mes' },
];

// Los gustos de ejemplo: en el formulario de productos salen del back
export const GUSTOS: OpcionSelect<string>[] = ['Dulce', 'Salado', 'Agridulce', 'Ácido', 'Amargo', 'Picante'].map(
  (gusto) => ({ valor: gusto, label: gusto }),
);

/** Estado de los ejemplos interactivos de la pantalla de diseño */
export function useDiseno() {
  const { width } = useWindowDimensions();
  const [cargando, setCargando] = useState(false);
  const [texto, setTexto] = useState('');
  const [periodo, setPeriodo] = useState<Periodo>('hoy');
  const [gusto, setGusto] = useState<string | null>(null);

  // El botón de ejemplo muestra el spinner un rato y vuelve solo
  useEffect(() => {
    if (!cargando) return;
    const temporizador = setTimeout(() => setCargando(false), DURACION_CARGA_MS);
    return () => clearTimeout(temporizador);
  }, [cargando]);

  return {
    // Mobile-first: 2 columnas en el celular, más a medida que hay ancho
    columnas: width >= 900 ? 4 : width >= 600 ? 3 : 2,
    cargando,
    simularCarga: () => setCargando(true),
    texto,
    setTexto,
    periodo,
    setPeriodo,
    gusto,
    setGusto,
  };
}
