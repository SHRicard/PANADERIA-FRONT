import type { z } from 'zod';
import type { cotizacionSchema, formularioPedidoSchema, itemCotizadoSchema, pedidoCreadoSchema } from './schemas';

export type ItemCotizado = z.infer<typeof itemCotizadoSchema>;
export type Cotizacion = z.infer<typeof cotizacionSchema>;
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
}
