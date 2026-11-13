import { useSyncExternalStore } from 'react';

// No hay nada que escuchar: el valor no cambia mientras la página está abierta
const suscribirse = () => () => {};

/**
 * true recién en el navegador. La web se prerenderiza sin carrito (no hay localStorage en el servidor): lo que
 * depende del carrito se pinta después de hidratar, así el HTML y el primer render coinciden. `useSyncExternalStore`
 * usa el valor del servidor (false) al hidratar y el del cliente (true) enseguida después, sin un setState en un efecto
 */
export function useEnNavegador(): boolean {
  return useSyncExternalStore(
    suscribirse,
    () => true,
    () => false,
  );
}
