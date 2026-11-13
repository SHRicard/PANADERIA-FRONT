import type { z } from 'zod';
import type {
  agendaSchema,
  clientesSchema,
  detallePedidoSchema,
  diaAgendaSchema,
  formularioProductosPorDiaSchema,
  formularioQuiereHacerSchema,
  NIVELES_AGENDA,
  ESTADOS_PEDIDO,
  formularioPedidoManualSchema,
  formularioSenaSchema,
  ORIGENES_PEDIDO,
  itemPedidoSchema,
  paginaPedidosSchema,
  pedidoSchema,
  produccionDelDiaSchema,
} from './schemas';

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];
export type OrigenPedido = (typeof ORIGENES_PEDIDO)[number];
export type ItemPedido = z.infer<typeof itemPedidoSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;
export type PaginaPedidos = z.infer<typeof paginaPedidosSchema>;
export type DetallePedido = z.infer<typeof detallePedidoSchema>;
export type FormularioSena = z.infer<typeof formularioSenaSchema>;
export type FormularioPedidoManual = z.infer<typeof formularioPedidoManualSchema>;
export type FormularioProductosPorDia = z.infer<typeof formularioProductosPorDiaSchema>;
export type FormularioQuiereHacer = z.infer<typeof formularioQuiereHacerSchema>;
export type NivelAgenda = (typeof NIVELES_AGENDA)[number];
export type DiaAgenda = z.infer<typeof diaAgendaSchema>;
export type Agenda = z.infer<typeof agendaSchema>;
export type ProduccionDelDia = z.infer<typeof produccionDelDiaSchema>;
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
  /** true: hay que mandárselo · false: lo pasa a retirar */
  conEnvio: boolean;
  /** Para qué día (AAAA-MM-DD). Cualquiera: el dueño no tiene las reglas de la web */
  fechaEntrega: string;
}

/** Los filtros de GET /api/pedidos. Sin ninguno, vienen todos */
export interface FiltrosPedidos {
  estado?: EstadoPedido;
  /** Los de un día de la agenda (AAAA-MM-DD) */
  fechaEntrega?: string;
}

/** Lo que viaja a PUT /api/pedidos/:id/fecha-entrega */
export interface FechaEntregaEditada {
  id: string;
  fechaEntrega: string;
}

/** Lo que viaja a PUT /api/pedidos/:id/items: la lista completa, como tiene que quedar */
export interface ItemsPedidoEditados {
  id: string;
  items: { productoId: string; cantidad: number }[];
}
