import { z } from 'zod';

// ── Respuestas de la API ──────────────────────────────────────────────────────

export const imagenSchema = z.object({
  id: z.string(),
  url: z.url(),
  miniatura: z.url(),
});

/** Una recomendación que dejó alguien desde la web. texto y autor son opcionales */
export const recomendacionSchema = z.object({
  id: z.string(),
  /** Estrellas, de 1 a 5 */
  puntaje: z.number().int().min(1).max(5),
  texto: z.string().optional(),
  autor: z.string().optional(),
  createdAt: z.string(),
});

/** El tipo del producto (Tortas, Tartas…), de los que arma el dueño en Más → Tipos */
export const tipoDeProductoSchema = z.object({ _id: z.string(), nombre: z.string() });

/** GET /api/productos y todas las rutas privadas de productos: el producto completo, con sus fotos en orden */
export const productoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  precio: z.number().positive(),
  descripcion: z.string().optional(),
  /** Texto que elige el dueño para destacarlo ("Nuevo", "Promo lanzamiento"…). Si no tiene, no viene */
  etiqueta: z.string().optional(),
  ingredientes: z.array(z.string()),
  pesoGramos: z.number().positive().optional(),
  // El gusto. z.string() y no un enum: si el back suma un gusto, la app no se rompe
  categoria: z.string(),
  /** Opcional: null si no tiene. El default cubre la app nueva contra un back que todavía no lo manda */
  tipo: tipoDeProductoSchema.nullable().default(null),
  /** Con cuántas horas de anticipación hay que encargarlo; 0 = se pide en el momento. Informativa */
  anticipacionHoras: z.number().int().min(0),
  /** false = pausado: no sale en el catálogo ni se puede pedir */
  disponible: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  imagenes: z.array(imagenSchema).max(10),
  /** Promedio de estrellas con un decimal, o null si nadie lo recomendó todavía */
  puntajePromedio: z.number().nullable(),
  cantidadRecomendaciones: z.number().int(),
  /** Solo en los detalles (GET /api/productos/:id y /api/catalogo/:id), de la más nueva a la más vieja */
  recomendaciones: z.array(recomendacionSchema).max(50).optional(),
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

/** Hasta cuántos caracteres acepta el back en la etiqueta */
export const ETIQUETA_MAX = 30;

/** Hasta cuántas horas de anticipación acepta el back (30 días) */
export const ANTICIPACION_MAX = 720;

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
  etiqueta: z.string().trim().max(ETIQUETA_MAX, `La etiqueta puede tener hasta ${ETIQUETA_MAX} caracteres`),
  categoria: z.string().min(1, 'Elegí un gusto'),
  /** El _id del tipo; '' = sin tipo (es opcional) */
  tipo: z.string(),
  anticipacionHoras: z
    .string()
    .trim()
    .min(1, 'Ingresá con cuántas horas hay que encargarlo (0 si se pide en el momento)')
    .regex(entero, 'Solo números, sin puntos ni comas')
    .refine((valor) => Number(valor) <= ANTICIPACION_MAX, `Hasta ${ANTICIPACION_MAX} horas (30 días)`),
  pesoGramos: z
    .string()
    .trim()
    .refine((valor) => valor === '' || entero.test(valor), 'Solo números, sin puntos ni comas')
    .refine((valor) => valor === '' || Number(valor) > 0, 'El peso tiene que ser mayor que 0'),
  ingredientes: z.string().trim(),
  /** true = activo; false = pausado (no aparece en el catálogo público) */
  disponible: z.boolean(),
});
