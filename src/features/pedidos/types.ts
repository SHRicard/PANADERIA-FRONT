import type { z } from 'zod';
import type {
  detallePedidoSchema,
  ESTADOS_PEDIDO,
  formularioSenaSchema,
  itemPedidoSchema,
  paginaPedidosSchema,
  pedidoSchema,
} from './schemas';

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];
export type ItemPedido = z.infer<typeof itemPedidoSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
export type PaginaPedidos = z.infer<typeof paginaPedidosSchema>;
export type DetallePedido = z.infer<typeof detallePedidoSchema>;
export type FormularioSena = z.infer<typeof formularioSenaSchema>;

/** Los filtros de GET /api/pedidos. Sin estado, vienen todos */
export interface FiltrosPedidos {
  estado?: EstadoPedido;
}
