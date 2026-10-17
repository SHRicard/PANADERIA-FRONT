import type { Promo, ResultadoCompartir } from './types';

// La versión web de compartir.native.ts. react-native-share no existe en la web y rompe el bundle si se importa,
// y las pantallas del admin también se compilan para la web (output "static"): por eso va en un archivo aparte

export const sePuedeCompartir = false;

export async function compartirEnEstado(_promo: Promo, _texto: string): Promise<ResultadoCompartir> {
  throw new Error('Compartir en el estado de WhatsApp solo funciona en la app');
}
