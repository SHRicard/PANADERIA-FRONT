import { config } from '@/config';

/**
 * Lo que va en el mensaje: un saludo y el link al catálogo. Con el link en su propio renglón, WhatsApp arma la vista
 * previa con el nombre y el logo (el HTML prerenderizado de la web). En WhatsApp se puede editar antes de mandarlo
 */
export function textoCatalogo(): string {
  return [
    '¡Hola! 👋 Te paso el catálogo de Dama Blanca: ahí ves todos los productos con sus precios y podés hacer tu pedido.',
    `👉 ${config.webUrl}`,
  ].join('\n\n');
}

/** El link sin «https://»: para mostrarlo en la tarjeta, que se lea de un vistazo cuál es */
export function linkParaMostrar(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
