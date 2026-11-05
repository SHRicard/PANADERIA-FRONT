/**
 * El link de WhatsApp del dueño (`config.whatsappUrl`) con el mensaje ya escrito: wa.me lo recibe en `text`.
 * Lo usan el pago de la seña y el cartel de negocio cerrado
 */
export function enlaceWhatsapp(base: string, mensaje: string): string {
  return `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(mensaje)}`;
}
