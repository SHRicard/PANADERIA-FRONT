import { z } from 'zod';
import { productoSchema, recomendacionSchema, tipoDeProductoSchema } from '@/features/productos';

/**
 * Cada producto de GET /api/catalogo: sin el array de fotos (con la portada en miniatura, o null si no tiene)
 * y sin las recomendaciones, que vienen solo en el detalle
 */
export const productoCatalogoSchema = productoSchema.omit({ imagenes: true, recomendaciones: true }).extend({
  portada: z.url().nullable(),
  cantidadImagenes: z.number().int(),
});

/** GET /api/catalogo: una página, solo con productos activos */
export const paginaCatalogoSchema = z.object({
  productos: z.array(productoCatalogoSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalProductos: z.number().int(),
  totalPaginas: z.number().int(),
});

/** Una sección de la carta: los productos de un tipo. tipo null = los que no tienen tipo (siempre la última) */
export const seccionCatalogoSchema = z.object({
  tipo: tipoDeProductoSchema.nullable(),
  productos: z.array(productoCatalogoSchema),
});

/** GET /api/catalogo/secciones: la carta, agrupada y ordenada por el back, sin paginar */
export const seccionesCatalogoSchema = z.object({
  secciones: z.array(seccionCatalogoSchema),
  totalProductos: z.number().int(),
});

/** GET /api/catalogo/filtros: los tipos y los gustos con productos activos, con cuántos tiene cada uno */
export const filtrosCatalogoSchema = z.object({
  tipos: z.array(tipoDeProductoSchema.extend({ cantidad: z.number().int() })),
  categorias: z.array(z.object({ nombre: z.string(), cantidad: z.number().int() })),
});

/** POST /api/catalogo/:id/recomendaciones: la recomendación guardada y el resumen del producto ya recalculado */
export const recomendacionCreadaSchema = z.object({
  recomendacion: recomendacionSchema,
  puntajePromedio: z.number().nullable(),
  cantidadRecomendaciones: z.number().int(),
});

// ── Formulario ────────────────────────────────────────────────────────────────

/** Recomendar un producto. Las mismas reglas que el back, para avisar antes de mandar. 0 = no eligió estrellas */
export const formularioRecomendacionSchema = z.object({
  puntaje: z.number().int().min(1, 'Tocá las estrellas para dar tu voto').max(5),
  texto: z.string().trim().max(300, 'Puede tener hasta 300 letras'),
  autor: z
    .string()
    .trim()
    .refine((valor) => valor === '' || valor.length >= 2, 'Escribí al menos 2 letras, o dejalo vacío')
    .refine((valor) => valor.length <= 60, 'El nombre puede tener hasta 60 letras'),
});
