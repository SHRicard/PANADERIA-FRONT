import type { CambiosProducto, DatosProducto, Producto, ProductoFormulario } from './types';

/** El formulario vacío del alta */
export const FORMULARIO_VACIO: ProductoFormulario = {
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: '',
  pesoGramos: '',
  ingredientes: '',
  disponible: true,
};

/** Un producto guardado, pasado a los campos del formulario (todo texto) para editarlo */
export function aFormulario(producto: Producto): ProductoFormulario {
  return {
    nombre: producto.nombre,
    precio: String(producto.precio),
    descripcion: producto.descripcion ?? '',
    categoria: producto.categoria,
    pesoGramos: producto.pesoGramos ? String(producto.pesoGramos) : '',
    ingredientes: producto.ingredientes.join(', '),
    disponible: producto.disponible,
  };
}

/** Del formulario a lo que espera el back. Lo opcional que quedó vacío no se manda */
export function aDatosProducto(valores: ProductoFormulario): DatosProducto {
  return {
    nombre: valores.nombre,
    precio: Number(valores.precio),
    categoria: valores.categoria,
    disponible: valores.disponible,
    ingredientes: valores.ingredientes
      .split(',')
      .map((ingrediente) => ingrediente.trim())
      .filter(Boolean),
    ...(valores.descripcion && { descripcion: valores.descripcion }),
    ...(valores.pesoGramos && { pesoGramos: Number(valores.pesoGramos) }),
  };
}

/**
 * Solo lo que cambió respecto del producto guardado: el PUT no toca lo que no viene.
 * Si devuelve `{}`, no hay nada que guardar
 */
export function cambiosDe(original: Producto, valores: ProductoFormulario): CambiosProducto {
  const nuevos = aDatosProducto(valores);
  const cambios: CambiosProducto = {};

  if (nuevos.nombre !== original.nombre) cambios.nombre = nuevos.nombre;
  if (nuevos.precio !== original.precio) cambios.precio = nuevos.precio;
  if (nuevos.categoria !== original.categoria) cambios.categoria = nuevos.categoria;
  if (nuevos.disponible !== original.disponible) cambios.disponible = nuevos.disponible;
  if (nuevos.ingredientes.join('\n') !== original.ingredientes.join('\n')) cambios.ingredientes = nuevos.ingredientes;
  // Un opcional que quedó vacío viaja como null: el back lo borra del producto
  if (nuevos.descripcion !== original.descripcion) cambios.descripcion = nuevos.descripcion ?? null;
  if (nuevos.pesoGramos !== original.pesoGramos) cambios.pesoGramos = nuevos.pesoGramos ?? null;

  return cambios;
}
