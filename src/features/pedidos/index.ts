// Lo que usan otras features (Métricas, cómo se llama cada estado y la marca de los pedidos cargados a mano;
// el Inicio, la agenda)
export { TarjetaPedido } from './components/TarjetaPedido';
// El inicio: la agenda reemplaza «Lo de hoy»
export { AgendaPedidos } from './components/AgendaPedidos';
export { useAgenda } from './hooks/useAgenda';
export { pedidoSchema } from './schemas';
export { ESTADO, MARCA_MANUAL } from './textos';
export type { EstadoPedido, Pedido } from './types';
