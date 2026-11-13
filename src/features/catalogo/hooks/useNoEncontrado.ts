import { useRouter } from 'expo-router';

/**
 * La página de un link que no existe. Es una sola para toda la web, con el estilo base de la app: no cambia con el
 * estilo del catálogo (Navidad). Además del buscador (`useBuscadorRapido`), el camino de vuelta al catálogo
 */
export function useNoEncontrado() {
  const router = useRouter();

  return {
    irAlCatalogo: () => router.replace('/'),
  };
}

export type NoEncontrado = ReturnType<typeof useNoEncontrado>;
