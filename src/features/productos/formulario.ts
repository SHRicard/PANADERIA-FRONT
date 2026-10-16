import type { CambiosProducto, DatosProducto, Producto, ProductoFormulario } from './types';

/** El formulario vacío del alta */
export const FORMULARIO_VACIO: ProductoFormulario = {
  nombre: '',
  precio: '',
  descripcion: '',
  etiqueta: '',
  categoria: '',
  // Vacía a propósito: la tiene que elegir el dueño, el back no pone una por defecto
  anticipacionHoras: '',
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
    etiqueta: producto.etiqueta ?? '',
    categoria: producto.categoria,
    anticipacionHoras: String(producto.anticipacionHoras),
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
    anticipacionHoras: Number(valores.anticipacionHoras),
    disponible: valores.disponible,
    ingredientes: valores.ingredientes
      .split(',')
      .map((ingrediente) => ingrediente.trim())
      .filter(Boolean),
    ...(valores.descripcion && { descripcion: valores.descripcion }),
    ...(valores.etiqueta && { etiqueta: valores.etiqueta }),
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
  if (nuevos.anticipacionHoras !== original.anticipacionHoras) cambios.anticipacionHoras = nuevos.anticipacionHoras;
  if (nuevos.disponible !== original.disponible) cambios.disponible = nuevos.disponible;
  if (nuevos.ingredientes.join('\n') !== original.ingredientes.join('\n')) cambios.ingredientes = nuevos.ingredientes;
  // Un opcional que quedó vacío viaja como null: el back lo borra del producto
  if (nuevos.descripcion !== original.descripcion) cambios.descripcion = nuevos.descripcion ?? null;
  if (nuevos.etiqueta !== original.etiqueta) cambios.etiqueta = nuevos.etiqueta ?? null;
  if (nuevos.pesoGramos !== original.pesoGramos) cambios.pesoGramos = nuevos.pesoGramos ?? null;

  return cambios;
}
