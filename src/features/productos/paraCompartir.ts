import { config } from '@/config';
import type { ArchivoParaCompartir } from '@/services/compartir';
import { formatearPrecio, nombreParaMostrar, textoAnticipacion } from '@/shared/utils';
import type { Producto } from './types';

/**
 * Lo que acompaña la foto: el nombre en negrita, la descripción, el precio con la anticipación y el link al producto
 * en la web, para pedirlo ahí. Por ejemplo:
 *
 *   *Pastafrola de membrillo*
 *   Masa frola con dulce de membrillo
 *   $ 16.000 · Con 24 hs de anticipación
 *
 *   Hacé tu pedido acá 👉 https://…/producto/6ad9c957…
 */
export function textoParaCompartir(producto: Producto): string {
  const precio = [formatearPrecio(producto.precio), textoAnticipacion(producto.anticipacionHoras)]
    .filter(Boolean)
    .join(' · ');
  const datos = [`*${nombreParaMostrar(producto.nombre)}*`, producto.descripcion, precio].filter(Boolean).join('\n');
  return [datos, `Hacé tu pedido acá 👉 ${config.webUrl}/producto/${producto._id}`].join('\n\n');
}

/**
 * La portada, en .jpg. La URL viene con f_auto, y Cloudinary le manda un .webp a quien diga que lo acepta: WhatsApp
 * lo tomaría como sticker. Sin fotos, se comparte solo el texto
 */
export function fotoParaCompartir(producto: Producto): ArchivoParaCompartir | undefined {
  const portada = producto.imagenes[0];
  if (!portada) return undefined;
  // Cada foto tiene su id y su archivo no cambia: si el dueño cambia la portada, cambia la clave
  return { url: portada.url.replace(',f_auto/', ',f_jpg/'), clave: `producto-${portada.id}`, tipo: 'imagen' };
}
