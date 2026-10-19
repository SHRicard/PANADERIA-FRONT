import { z } from 'zod';

/** Qué tan cerca está la cuenta de Cloudinary del límite del plan (el back lo calcula con el porcentaje de créditos) */
export const NIVELES_USO = ['ok', 'atencion', 'critico', 'excedido'] as const;

const cantidad = z.number().nonnegative();

/** GET /api/almacenamiento: el uso de la cuenta de Cloudinary, donde están las fotos y los videos */
export const usoCloudinarySchema = z.object({
  plan: z.string(),
  nivel: z.enum(NIVELES_USO),
  /** 1 crédito = 1 GB guardado, 1 GB entregado o 1000 transformaciones */
  creditos: z.object({ usados: cantidad, limite: z.number().positive(), restantes: cantidad, porcentaje: cantidad }),
  /** Lo guardado ahora */
  almacenamiento: z.object({ bytes: cantidad, creditos: cantidad }),
  /** Lo entregado en los últimos 30 días */
  anchoDeBanda: z.object({ bytes: cantidad, creditos: cantidad }),
  /** Versiones generadas en los últimos 30 días (marca de agua, miniaturas, formatos) */
  transformaciones: z.object({ cantidad, creditos: cantidad }),
  /** Fotos y videos subidos */
  archivos: cantidad,
  /** Versiones generadas de esos archivos */
  derivados: cantidad,
  /** Día del último cálculo de Cloudinary, AAAA-MM-DD */
  actualizadoAl: z.string().nullable(),
  /** Cuándo le preguntó el back a Cloudinary (ISO): lo guarda 10 minutos */
  consultadoEn: z.string(),
});

// ── Lo que ocupa cada archivo ─────────────────────────────────────────────────

/** De dónde sale el archivo: una foto de un producto o el archivo de una promo */
export const ORIGENES_ARCHIVO = ['producto', 'promo'] as const;

const datosDelArchivo = {
  bytes: cantidad,
  miniatura: z.string(),
  /** Cuándo se subió a Cloudinary (ISO) */
  subidoEn: z.string(),
};

/** Una foto de un producto. Se borra con DELETE /api/productos/:productoId/imagenes/:imagenId */
export const fotoDeProductoSchema = z.object({
  origen: z.literal('producto'),
  productoId: z.string(),
  imagenId: z.string(),
  /** El nombre del producto */
  nombre: z.string(),
  /** La primera foto del producto */
  portada: z.boolean(),
  /** false = el producto está pausado */
  disponible: z.boolean(),
  ...datosDelArchivo,
});

/** El archivo de una promo. Se borra con DELETE /api/promos/:promoId: la promo entera (tiene un solo archivo) */
export const archivoDePromoSchema = z.object({
  origen: z.literal('promo'),
  promoId: z.string(),
  titulo: z.string(),
  tipo: z.enum(['imagen', 'video']),
  ...datosDelArchivo,
});

export const archivoAlmacenadoSchema = z.discriminatedUnion('origen', [fotoDeProductoSchema, archivoDePromoSchema]);

/** GET /api/almacenamiento/archivos: lo que más ocupa primero */
export const paginaArchivosSchema = z.object({
  archivos: z.array(archivoAlmacenadoSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalArchivos: z.number().int(),
  totalPaginas: z.number().int(),
  /** Lo que ocupan todos (con el filtro), no solo los de esta página */
  totalBytes: cantidad,
});
