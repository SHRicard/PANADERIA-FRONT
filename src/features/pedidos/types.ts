import type { z } from 'zod';
import type {
  clientesSchema,
  detallePedidoSchema,
  ESTADOS_PEDIDO,
  formularioPedidoManualSchema,
  formularioSenaSchema,
  ORIGENES_PEDIDO,
  itemPedidoSchema,
  paginaPedidosSchema,
  pedidoSchema,
} from './schemas';

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];
export type OrigenPedido = (typeof ORIGENES_PEDIDO)[number];
export type ItemPedido = z.infer<typeof itemPedidoSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
export type PaginaPedidos = z.infer<typeof paginaPedidosSchema>;
export type DetallePedido = z.infer<typeof detallePedidoSchema>;
export type FormularioSena = z.infer<typeof formularioSenaSchema>;
export type FormularioPedidoManual = z.infer<typeof formularioPedidoManualSchema>;
/** Un cliente de GET /api/clientes */
export type ClienteGuardado = z.infer<typeof clientesSchema>[number];

/** Lo que viaja a POST /api/pedidos/manuales */
export interface NuevoPedidoManual {
  cliente: {
    nombre: string;
    /** Como lo escriba el dueño: el back lo normaliza */
    telefono: string;
  };
  items: { productoId: string; cantidad: number }[];
  nota?: string;
  /** Si el cliente ya transfirió la seña: el pedido entra confirmado */
  sena?: { monto: number };
}

/** Los filtros de GET /api/pedidos. Sin estado, vienen todos */
export interface FiltrosPedidos {
  estado?: EstadoPedido;
}
