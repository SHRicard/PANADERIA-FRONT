import { ScreenContainer } from '@/shared/ui/atoms';
import { NoEncontradoReceta } from '../components/noEncontrado/NoEncontradoReceta';
import { useNoEncontrado } from '../hooks/useNoEncontrado';

/**
 * Un link de la web que no existe (viejo o mal copiado): «A esta receta le falta algo», con el buscador para ir directo
 * a un producto. Una sola para toda la web, con el estilo base de la app: la ruta está en la raíz
 * (`src/app/+not-found.tsx`), afuera del tema del catálogo
 */
export function NoEncontradoScreen() {
  const pagina = useNoEncontrado();

  return (
    <ScreenContainer width="form" llenarAlto>
      <NoEncontradoReceta pagina={pagina} />
    </ScreenContainer>
  );
}
