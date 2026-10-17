import type { z } from 'zod';
import type { formularioPromoSchema, promoSchema } from './schemas';

export type Promo = z.infer<typeof promoSchema>;
export type TipoPromo = Promo['tipo'];
export type FormularioPromo = z.infer<typeof formularioPromoSchema>;

/** El archivo elegido en la galería, listo para subir */
export interface ArchivoPromo {
  uri: string;
  tipo: TipoPromo;
  /** Solo en los videos, si la galería la sabe: para la vista previa (el primer fotograma no está hasta subirlo) */
  duracionSegundos?: number;
}

/** POST /api/promos */
export interface DatosPromo {
  titulo: string;
  texto?: string;
  archivo: ArchivoPromo;
}

/** PATCH /api/promos/:id: solo lo que cambia. texto en null lo borra */
export interface CambiosPromo {
  titulo?: string;
  texto?: string | null;
}

/** Cómo terminó el toque en Compartir */
export type ResultadoCompartir = 'compartido' | 'sin-whatsapp';
