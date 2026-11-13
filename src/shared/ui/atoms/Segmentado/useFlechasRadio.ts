import { useRef } from 'react';
import { Platform, type KeyDownEvent, type ViewInstance } from 'react-native';

// Cuánto se mueve la elección con cada flecha: a la derecha o abajo, la siguiente; a la izquierda o arriba, la anterior
const PASOS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * Un grupo de radios que se maneja con el teclado, como los del navegador: con Tab se entra a la opción elegida (o a
 * la primera, si no hay ninguna) y con las flechas se elige la de al lado, dando la vuelta en las puntas. En el
 * celular no cambia nada.
 *
 * `grupo` va con spread en el View del `radiogroup` y `opcion(i)`, en cada radio
 */
export function useFlechasRadio<T>(valores: readonly T[], valor: T | null | undefined, alCambiar: (valor: T) => void) {
  const radios = useRef<(ViewInstance | null)[]>([]);
  const elegida = valor == null ? -1 : valores.indexOf(valor);
  const conFoco = Math.max(elegida, 0);

  return {
    grupo: {
      onKeyDown: (tecla: KeyDownEvent) => {
        const paso = PASOS[tecla.nativeEvent.key];
        if (!paso || valores.length === 0) return;
        // Sin esto, la flecha también mueve el scroll de la página
        tecla.preventDefault();
        // Sin ninguna elegida, la primera flecha elige la primera (o la última, si va para atrás)
        const desde = elegida === -1 ? (paso > 0 ? -1 : 0) : elegida;
        const nueva = (desde + paso + valores.length) % valores.length;
        alCambiar(valores[nueva]);
        radios.current[nueva]?.focus();
      },
    },
    opcion: (indice: number) => ({
      ref: (radio: ViewInstance | null) => {
        radios.current[indice] = radio;
      },
      // Solo en la web: en Android, -1 deja el radio sin foco para un teclado conectado
      tabIndex: Platform.OS !== 'web' ? undefined : indice === conFoco ? (0 as const) : (-1 as const),
    }),
  };
}
