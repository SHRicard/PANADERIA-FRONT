import type { z } from 'zod';
import type {
  categoriasSchema,
  imagenSchema,
  paginaProductosSchema,
  productoFormSchema,
  productoSchema,
} from './schemas';

export type Imagen = z.infer<typeof imagenSchema>;
export type Producto = z.infer<typeof productoSchema>;
export type PaginaProductos = z.infer<typeof paginaProductosSchema>;
export type Categoria = z.infer<typeof categoriasSchema>[number];
export type ProductoFormulario = z.infer<typeof productoFormSchema>;

/** activo = disponible: true; pausado = disponible: false */
export type EstadoProducto = 'activo' | 'pausado';

/** Los filtros de GET /api/productos. Lo que no viene, no filtra */
export interface FiltrosProductos {
  /** Una parte del nombre: el back no distingue mayúsculas ni acentos */
  buscar?: string;
  /** El gusto: Dulce, Salado… */
  categoria?: string;
  estado?: EstadoProducto;
}

/** Lo que viaja a POST /api/productos (JSON, sin fotos: las fotos van después, por la cola) */
export type DatosProducto = Pick<Producto, 'nombre' | 'precio' | 'categoria' | 'ingredientes' | 'disponible'> &
  Partial<Pick<Producto, 'descripcion' | 'pesoGramos'>>;

/** Lo que viaja a PUT /api/productos/:id: solo lo que cambió. Un opcional en null se borra del producto */
export type CambiosProducto = Partial<
  Pick<DatosProducto, 'nombre' | 'precio' | 'categoria' | 'ingredientes' | 'disponible'>
> & {
  descripcion?: string | null;
  pesoGramos?: number | null;
};

/** Una foto elegida en el celular, ya achicada (JPEG en la caché de la app), todavía sin subir */
export interface FotoLocal {
  /** Id propio del front, para seguirla en la cola */
  idLocal: string;
  uri: string;
}
