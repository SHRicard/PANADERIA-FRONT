import { PantallaPestana } from '@/features/navegacion';
import { Text } from '@/shared/ui/atoms';

// Inicio del admin. Placeholder: cuando muestre datos de la API (pedidos del día, productos), suma useRefrescar
export function DashboardScreen() {
  return (
    <PantallaPestana pestana="dashboard">
      <Text color="textMuted">Muy pronto vas a ver acá un resumen del día: los pedidos nuevos y los productos.</Text>
    </PantallaPestana>
  );
}
