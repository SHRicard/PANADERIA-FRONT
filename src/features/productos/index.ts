// Lo que usan otras features (el catálogo público comparte el contrato del producto y los gustos; el pedido
// manual, la lista de productos para elegir; Memoria, borrar una foto desde su lista)
export { useBorrarFotoMutation, useListarCategoriasQuery, useListarProductosInfiniteQuery } from './api/productosApi';
export { productoSchema, recomendacionSchema } from './schemas';
export type { Categoria, Imagen, Producto, Recomendacion } from './types';
