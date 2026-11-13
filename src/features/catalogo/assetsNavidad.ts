/**
 * Los dibujos del catálogo de Navidad (`assets/navidad/` de la feature: WebP con fondo transparente, y los dos logos de
 * Navidad).
 * Todos los require() viven acá: los componentes los piden por nombre con `Ilustracion`. `proporcion` es ancho / alto,
 * para reservar el lugar justo antes de que cargue la imagen. Ningún dibujo lleva texto: lo que se lee va con <Text>
 */
export interface AssetNavidad {
  /** Lo que devuelve require(): va tal cual en el `source` de expo-image */
  fuente: number;
  proporcion: number;
}

const asset = (fuente: number, ancho: number, alto: number): AssetNavidad => ({ fuente, proporcion: ancho / alto });

export const ASSETS_NAVIDAD = {
  // Los logos de Navidad: el verde (con el aro de bastón y las lucecitas) y el crema
  logoVerde: asset(require('@/features/catalogo/assets/navidad/logo-navidad-2-512.webp'), 512, 512),
  logoCrema: asset(require('@/features/catalogo/assets/navidad/logo-navidad-512.webp'), 512, 512),

  // Lo que cuelga: esferas, campanas y la galletita
  esferaAzulMono: asset(require('@/features/catalogo/assets/navidad/esfera-azul-mono.webp'), 337, 398),
  esferaRojaCopo: asset(require('@/features/catalogo/assets/navidad/esfera-roja-copo.webp'), 304, 375),
  esferaNaranja: asset(require('@/features/catalogo/assets/navidad/esfera-naranja.webp'), 217, 274),
  campanaDorada: asset(require('@/features/catalogo/assets/navidad/campana-dorada.webp'), 407, 512),
  galletaEstrella: asset(require('@/features/catalogo/assets/navidad/galleta-estrella.webp'), 367, 370),

  // Personajes
  papaNoel: asset(require('@/features/catalogo/assets/navidad/papa-noel.webp'), 399, 512),
  renoGorro: asset(require('@/features/catalogo/assets/navidad/reno-gorro.webp'), 462, 512),
  osoGorro: asset(require('@/features/catalogo/assets/navidad/oso-gorro.webp'), 461, 512),
  osoGalleta: asset(require('@/features/catalogo/assets/navidad/oso-galleta.webp'), 415, 512),
  munecoNieveGorroPapaNoel: asset(require('@/features/catalogo/assets/navidad/muneco-nieve-gorro-papa-noel.webp'), 404, 512),
  munecoNieveGalera: asset(require('@/features/catalogo/assets/navidad/muneco-nieve-galera.webp'), 478, 512),
  munecoNieveBaston: asset(require('@/features/catalogo/assets/navidad/muneco-nieve-baston.webp'), 450, 512),
  bolitaGorro: asset(require('@/features/catalogo/assets/navidad/bolita-gorro.webp'), 429, 512),
  esferaCarita: asset(require('@/features/catalogo/assets/navidad/esfera-carita.webp'), 346, 483),
  coronaCarita: asset(require('@/features/catalogo/assets/navidad/corona-carita.webp'), 413, 419),
  globoNieve: asset(require('@/features/catalogo/assets/navidad/globo-nieve.webp'), 453, 512),

  // Árboles, regalos y lo demás
  arbol: asset(require('@/features/catalogo/assets/navidad/arbol.webp'), 391, 512),
  arbol2: asset(require('@/features/catalogo/assets/navidad/arbol-2.webp'), 401, 512),
  regaloRojo: asset(require('@/features/catalogo/assets/navidad/regalo-rojo.webp'), 423, 499),
  regaloVerde: asset(require('@/features/catalogo/assets/navidad/regalo-verde.webp'), 512, 491),
  regaloAzul: asset(require('@/features/catalogo/assets/navidad/regalo-azul.webp'), 440, 512),
  regaloDoradoAcebo: asset(require('@/features/catalogo/assets/navidad/regalo-dorado-acebo.webp'), 427, 430),
  acebo: asset(require('@/features/catalogo/assets/navidad/acebo.webp'), 378, 400),
  campanaAcebo: asset(require('@/features/catalogo/assets/navidad/campana-acebo.webp'), 330, 414),
  bastonesCruzados: asset(require('@/features/catalogo/assets/navidad/bastones-cruzados.webp'), 495, 467),
  baston: asset(require('@/features/catalogo/assets/navidad/baston.webp'), 254, 512),
  bota: asset(require('@/features/catalogo/assets/navidad/bota.webp'), 421, 512),
  canastaNavidena: asset(require('@/features/catalogo/assets/navidad/canasta-navidena.webp'), 469, 512),
} as const;

export type NombreAssetNavidad = keyof typeof ASSETS_NAVIDAD;
