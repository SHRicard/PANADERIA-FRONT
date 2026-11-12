import { MarcaNavidad } from '@/features/catalogo/components/navidad/MarcaNavidad';
import { SaludoNavidad } from './SaludoNavidad';

/**
 * Arriba del catálogo de Navidad de día: la marca con el logo de Navidad que respira y el regalo del pedido, y debajo el
 * saludo de Navidad (`SaludoNavidad`). La nieve no va acá: cae sobre toda la web (`NieveNavidad`, en `TemaCatalogo`)
 */
export function CabeceraDiaNavidad() {
  return (
    <>
      <MarcaNavidad logo="logoVerde" vivo />
      <SaludoNavidad />
    </>
  );
}
