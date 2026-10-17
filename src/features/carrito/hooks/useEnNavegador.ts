import { useEffect, useState } from 'react';

/**
 * true recién en el navegador. La web se prerenderiza sin carrito (no hay localStorage en el servidor): lo que
 * depende del carrito se pinta después de montar, así el HTML y el primer render coinciden
 */
export function useEnNavegador(): boolean {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  return montado;
}
