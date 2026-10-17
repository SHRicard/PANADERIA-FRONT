import { z } from 'zod';

// Los mismos límites que el back (models/Promo.ts)
export const LARGO_TITULO = { min: 2, max: 60 };
export const MAX_TEXTO = 500;
export const MAX_SEGUNDOS_VIDEO = 15;
export const MB_POR_FOTO = 10;
export const MB_POR_VIDEO = 50;

/** Una promo de la biblioteca: así la responden todos los endpoints de /api/promos */
export const promoSchema = z.object({
  _id: z.string(),
  tipo: z.enum(['imagen', 'video']),
  titulo: z.string(),
  /** Lo que acompaña la publicación. Sin texto, no viene */
  texto: z.string().optional(),
  /** El .jpg o el .mp4 con la marca de agua: es lo que se descarga para compartir */
  url: z.string(),
  /** Un .jpg chico para la lista (en los videos, el primer fotograma) */
  miniatura: z.string(),
  /** Solo en los videos */
  duracionSegundos: z.number().optional(),
  vecesPublicada: z.number().int().nonnegative(),
  /** La última vez que se tocó Compartir; null si nunca */
  ultimaPublicacion: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** GET /api/promos: toda la biblioteca, la más nueva primero */
export const promosSchema = z.array(promoSchema);

// ── Formulario ────────────────────────────────────────────────────────────────

const TITULO_INVALIDO = `El título tiene que tener entre ${LARGO_TITULO.min} y ${LARGO_TITULO.max} caracteres`;

export const formularioPromoSchema = z.object({
  titulo: z.string().trim().min(LARGO_TITULO.min, TITULO_INVALIDO).max(LARGO_TITULO.max, TITULO_INVALIDO),
  texto: z.string().trim().max(MAX_TEXTO, `El texto puede tener hasta ${MAX_TEXTO} caracteres`),
});
