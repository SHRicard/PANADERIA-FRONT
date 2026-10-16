import type { z } from 'zod';
import type {
  formularioRecomendacionSchema,
  paginaCatalogoSchema,
  productoCatalogoSchema,
  recomendacionCreadaSchema,
} from './schemas';

export type ProductoCatalogo = z.infer<typeof productoCatalogoSchema>;
export type PaginaCatalogo = z.infer<typeof paginaCatalogoSchema>;
export type RecomendacionCreada = z.infer<typeof recomendacionCreadaSchema>;
export type FormularioRecomendacion = z.infer<typeof formularioRecomendacionSchema>;

/** Lo que viaja a POST /api/catalogo/:id/recomendaciones. texto y autor vacíos no se guardan */
export interface NuevaRecomendacion {
  /** Entero de 1 a 5 */
  puntaje: number;
  /** Hasta 300 caracteres */
  texto?: string;
  /** De 2 a 60 caracteres */
  autor?: string;
}

/** Los filtros de GET /api/catalogo. No hay estado: el back siempre muestra solo los activos */
export interface FiltrosCatalogo {
  /** Una parte del nombre: el back no distingue mayúsculas ni acentos */
  buscar?: string;
  /** El gusto: Dulce, Salado… */
  categoria?: string;
}

export interface ConsultaCatalogo extends FiltrosCatalogo {
  /** Productos por página (el back acepta hasta 100) */
  limite: number;
}

/** Cómo se ve el catálogo. Lo elige el dueño en Más → Preferencias y se guarda en el back */
export type EstiloCatalogo = 'vidriera' | 'carta';
