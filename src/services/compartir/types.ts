/** La foto o el video que se manda a WhatsApp. Se baja a la caché la primera vez */
export interface ArchivoParaCompartir {
  /** De dónde se baja. Tiene que ser un .jpg o un .mp4: un .webp, WhatsApp lo toma como sticker */
  url: string;
  /** El nombre en la caché, sin extensión ("promo-<id>"). Siempre el mismo para el mismo archivo: así se baja una vez */
  clave: string;
  tipo: 'imagen' | 'video';
}

/** Cómo terminó el toque en Compartir */
export type ResultadoCompartir = 'compartido' | 'sin-whatsapp';
