import { Stack } from 'expo-router';
import { TemaCatalogo } from '@/features/catalogo';
import { NegocioAbierto } from '@/features/cierre';

// Si el dueño cerró el negocio por un tiempo (Más → Preferencias → Web → Cerrado), cualquier link de la web muestra el cartel
// en lugar del catálogo, un producto o el pedido (la vista previa del link va en src/app/+html.tsx: sale siempre).
// Adentro, el tema del estilo de temporada (Navidad) pinta el catálogo, el detalle y el pedido; el cartel no cambia
export default function PublicoLayout() {
  return (
    <NegocioAbierto>
      <TemaCatalogo>
        <Stack screenOptions={{ headerShown: false }} />
      </TemaCatalogo>
    </NegocioAbierto>
  );
}
