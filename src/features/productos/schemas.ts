import { z } from 'zod';

// ── Respuestas de la API ──────────────────────────────────────────────────────

export const imagenSchema = z.object({
  id: z.string(),
  url: z.url(),
  miniatura: z.url(),
});

/** GET /api/productos y todas las rutas privadas de productos: el producto completo, con sus fotos en orden */
export const productoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  precio: z.number().positive(),
  descripcion: z.string().optional(),
  ingredientes: z.array(z.string()),
  pesoGramos: z.number().positive().optional(),
  // El gusto. z.string() y no un enum: si el back suma un gusto, la app no se rompe
  categoria: z.string(),
  /** false = pausado: no sale en el catálogo ni se puede pedir */
  disponible: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  imagenes: z.array(imagenSchema).max(10),
});

/** GET /api/productos: una página de la lista */
export const paginaProductosSchema = z.object({
  productos: z.array(productoSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalProductos: z.number().int(),
  totalPaginas: z.number().int(),
});

/** GET /api/catalogo/categorias: los gustos (lista fija del back), en orden, con cuántos productos activos tiene cada uno */
export const categoriasSchema = z.array(z.object({ nombre: z.string(), cantidad: z.number().int() }));

// ── Formulario ────────────────────────────────────────────────────────────────

/** Hasta cuántas fotos acepta el back por producto */
export const FOTOS_MAX = 10;

// Precio y peso en números enteros: con decimales, "1.500" se confunde entre mil quinientos y uno coma cinco
const entero = /^\d+$/;

// Los campos llegan como texto. Las mismas reglas que el back; la conversión a números la hace el hook al enviar
export const productoFormSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá el nombre'),
  precio: z
    .string()
    .trim()
    .min(1, 'Ingresá el precio')
    .regex(entero, 'Solo números, sin puntos ni comas')
    .refine((valor) => Number(valor) > 0, 'El precio tiene que ser mayor que 0'),
  descripcion: z.string().trim(),
  categoria: z.string().min(1, 'Elegí un gusto'),
  pesoGramos: z
    .string()
    .trim()
    .refine((valor) => valor === '' || entero.test(valor), 'Solo números, sin puntos ni comas')
    .refine((valor) => valor === '' || Number(valor) > 0, 'El peso tiene que ser mayor que 0'),
  ingredientes: z.string().trim(),
  /** true = activo; false = pausado (no aparece en el catálogo público) */
  disponible: z.boolean(),
});
