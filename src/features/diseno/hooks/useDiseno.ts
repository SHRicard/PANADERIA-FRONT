import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

const DURACION_CARGA_MS = 1500;

/** Estado de los ejemplos interactivos de la pantalla de diseño */
export function useDiseno() {
  const { width } = useWindowDimensions();
  const [cargando, setCargando] = useState(false);
  const [texto, setTexto] = useState('');

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
  };
}
