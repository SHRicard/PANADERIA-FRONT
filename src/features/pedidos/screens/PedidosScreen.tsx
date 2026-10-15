import { PantallaPestana } from '@/features/navegacion';
import { Text } from '@/shared/ui/atoms';

// Placeholder. Cuando traiga /api/pedidos, suma useRefrescar en la misma tarea
export function PedidosScreen() {
  return (
    <PantallaPestana pestana="pedidos">
      <Text color="textMuted">Muy pronto vas a ver acá los pedidos de los clientes y vas a poder cambiarles el estado.</Text>
    </PantallaPestana>
  );
}
