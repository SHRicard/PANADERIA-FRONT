// Lo que usan otras features (el catálogo público comparte el contrato del producto y de su tipo; el pedido
// manual, la lista de productos para elegir; Memoria, borrar una foto desde su lista; Recetas, el precio nuevo que
// sale de la receta)
export { cambiarProductoEnCache, useBorrarFotoMutation, useListarProductosInfiniteQuery } from './api/productosApi';
export { productoSchema, recomendacionSchema, tipoDeProductoSchema } from './schemas';
export type { Imagen, Producto, Recomendacion } from './types';
