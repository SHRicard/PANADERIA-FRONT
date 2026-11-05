import { Stack } from 'expo-router';
import { VistaPreviaLink } from '@/features/catalogo';
import { NegocioAbierto } from '@/features/cierre';

// Si el dueño cerró el negocio por un tiempo (Más → Preferencias → Web → Cerrado), cualquier link de la web muestra el cartel
// en lugar del catálogo, un producto o el pedido. La vista previa del link va afuera: también se ve con el negocio cerrado
export default function PublicoLayout() {
  return (
    <>
      <VistaPreviaLink />
      <NegocioAbierto>
        <Stack screenOptions={{ headerShown: false }} />
      </NegocioAbierto>
    </>
  );
}
