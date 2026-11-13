import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { DiaCalendario, OpcionSegmentado, OpcionSelect } from '@/shared/ui/atoms';
import { diaDeHoy, mesDeHoy, sumarDias, sumarMeses } from '@/shared/utils';

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

/** Los días de ejemplo del calendario, como la agenda: hoy apagado, después libres, uno «Casi» y uno «Llena» */
function diasDeEjemplo(): Record<string, DiaCalendario> {
  const hoy = diaDeHoy();
  const dias: Record<string, DiaCalendario> = { [hoy]: { deshabilitado: true } };
  for (let i = 1; i <= 7; i++) dias[sumarDias(hoy, i)] = { aviso: 'Libre', tono: 'exito' };
  dias[sumarDias(hoy, 2)] = { aviso: 'Libre', tono: 'exito', contador: 4, queCuenta: 'productos' };
  dias[sumarDias(hoy, 3)] = { aviso: 'Casi', tono: 'atencion', contador: 18, queCuenta: 'productos' };
  dias[sumarDias(hoy, 5)] = { aviso: 'Llena', tono: 'peligro', contador: 27, queCuenta: 'productos' };
  return dias;
}

/** Estado de los ejemplos interactivos de la pantalla de diseño */
export function useDiseno() {
  const { width } = useWindowDimensions();
  const [cargando, setCargando] = useState(false);
  const [texto, setTexto] = useState('');
  const [periodo, setPeriodo] = useState<Periodo>('hoy');
  const [gusto, setGusto] = useState<string | null>(null);
  const [hojaAbierta, setHojaAbierta] = useState(false);
  const [mes, setMes] = useState(mesDeHoy);
  const [dia, setDia] = useState<string | null>(null);

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
    hojaAbierta,
    setHojaAbierta,
    calendario: {
      mes,
      seleccionado: dia,
      dias: diasDeEjemplo(),
      alElegir: setDia,
      alMesAnterior: () => setMes((m) => sumarMeses(m, -1)),
      alMesSiguiente: () => setMes((m) => sumarMeses(m, 1)),
    },
  };
}
