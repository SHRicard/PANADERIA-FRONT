// Lo que usan otras features (el catálogo público comparte el contrato del producto y los gustos; el pedido
// manual, la lista de productos para elegir)
export { useListarCategoriasQuery, useListarProductosInfiniteQuery } from './api/productosApi';
export { productoSchema, recomendacionSchema } from './schemas';
export type { Categoria, Imagen, Producto, Recomendacion } from './types';
