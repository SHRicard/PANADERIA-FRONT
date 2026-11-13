import type { z } from 'zod';
import type { cotizacionSchema, entregaSchema, formularioPedidoSchema, itemCotizadoSchema, pedidoCreadoSchema } from './schemas';

export type ItemCotizado = z.infer<typeof itemCotizadoSchema>;
export type Cotizacion = z.infer<typeof cotizacionSchema>;
/** Los días que puede elegir: `entrega` de la cotización */
export type EntregaDisponible = z.infer<typeof entregaSchema>;
export type PedidoCreado = z.infer<typeof pedidoCreadoSchema>;
export type FormularioPedido = z.infer<typeof formularioPedidoSchema>;

/** Lo único que guarda el carrito en el navegador: qué producto y cuántos. Los precios los da el back */
export interface ItemCarrito {
  productoId: string;
  /** Entero de 1 a 50 */
  cantidad: number;
}

/** Lo que viaja a POST /api/pedidos */
export interface NuevoPedido {
  cliente: {
    /** De 2 a 60 caracteres */
    nombre: string;
    /** Como lo escriba el cliente: el back lo normaliza (11 5555-1234, +54 9 11…) */
    telefono: string;
  };
  items: ItemCarrito[];
  /** Hasta 300 caracteres */
  nota?: string;
  /** true: quiere que se lo manden · false: lo pasa a retirar */
  conEnvio: boolean;
  /** Para qué día (AAAA-MM-DD). El back revisa que sea uno de los que ofreció la cotización */
  fechaEntrega: string;
  /**
   * La clave de este intento de confirmar (al azar): si el pedido llega dos veces (dos toques a la vez, o se cortó la
   * conexión después de guardarlo y el cliente volvió a confirmar), el back responde el mismo y no crea otro
   */
  intento: string;
}
