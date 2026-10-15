import { useEffect, useState } from 'react';

function segundosHasta(hasta: number | null): number {
  return hasta ? Math.max(0, Math.ceil((hasta - Date.now()) / 1000)) : 0;
}

/** Segundos que faltan hasta `hasta` (ms). Se actualiza cada segundo y se frena en 0 */
export function useCuentaRegresiva(hasta: number | null): number {
  const [segundos, setSegundos] = useState(() => segundosHasta(hasta));

  useEffect(() => {
    setSegundos(segundosHasta(hasta));
    if (!hasta) return;

    const intervalo = setInterval(() => {
      const restantes = segundosHasta(hasta);
      setSegundos(restantes);
      if (restantes === 0) clearInterval(intervalo);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [hasta]);

  return segundos;
}

/** 75 → "1:15" */
export function formatearSegundos(total: number): string {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
