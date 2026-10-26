import type { z } from 'zod';
import type {
  filtrosCatalogoSchema,
  formularioRecomendacionSchema,
  paginaCatalogoSchema,
  productoCatalogoSchema,
  recomendacionCreadaSchema,
  seccionCatalogoSchema,
  seccionesCatalogoSchema,
} from './schemas';

export type ProductoCatalogo = z.infer<typeof productoCatalogoSchema>;
export type PaginaCatalogo = z.infer<typeof paginaCatalogoSchema>;
export type RecomendacionCreada = z.infer<typeof recomendacionCreadaSchema>;
export type SeccionCatalogo = z.infer<typeof seccionCatalogoSchema>;
export type SeccionesCatalogo = z.infer<typeof seccionesCatalogoSchema>;
export type OpcionesDeFiltros = z.infer<typeof filtrosCatalogoSchema>;
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

/** Los filtros de GET /api/catalogo y /api/catalogo/secciones. No hay estado: el back siempre muestra solo los activos */
export interface FiltrosCatalogo {
  /** Una parte del nombre: el back no distingue mayúsculas ni acentos */
  buscar?: string;
  /** El gusto: Dulce, Salado… */
  categoria?: string;
  /** El _id del tipo */
  tipo?: string;
}

/** Una opción de un filtro de la web (un tipo o un gusto), lista para mostrar */
export interface OpcionFiltro {
  /** Lo que viaja al back: el _id del tipo o el nombre del gusto */
  valor: string;
  label: string;
  /** Cuántos productos activos tiene */
  cantidad: number;
}

export interface ConsultaCatalogo extends FiltrosCatalogo {
  /** Productos por página (el back acepta hasta 100) */
  limite: number;
}

/** Cómo se ve el catálogo. Lo elige el dueño en Más → Preferencias y se guarda en el back */
export type EstiloCatalogo = 'vidriera' | 'carta';
