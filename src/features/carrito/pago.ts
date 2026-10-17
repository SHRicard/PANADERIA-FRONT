import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import type { PedidoCreado } from './types';

/** El CBU o CVU de a 4 números, para leerlo sin perderse: "2850 5909 4009 0418 1352 01". Se copia sin espacios */
export function cbuParaLeer(cbu: string): string {
  return cbu.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** Para qué le escribe al dueño: pagar en efectivo, mandar el comprobante, o preguntar cómo pagar (sin datos) */
export type MotivoWhatsapp = 'efectivo' | 'comprobante' | 'coordinar';

/** Lo que el cliente le manda al dueño por WhatsApp, ya escrito: qué pidió, el total y la seña */
export function mensajeWhatsapp(pedido: PedidoCreado, sena: number, motivo: MotivoWhatsapp): string {
  const productos = pedido.items.map(({ cantidad, nombre }) => `• ${cantidad} × ${nombreParaMostrar(nombre)}`);
  const monto = formatearPrecio(sena);
  const pedidoQue = {
    efectivo: `Quiero pagar la seña de ${monto} en efectivo.`,
    comprobante: `Te mando el comprobante de la transferencia de la seña (${monto}).`,
    coordinar: `¿Cómo te pago la seña de ${monto}?`,
  }[motivo];
  return ['¡Hola! Acabo de hacer un pedido en la web:', ...productos, `Total: ${formatearPrecio(pedido.total)}. ${pedidoQue}`].join('\n');
}

/** El link del dueño con el mensaje ya escrito (wa.me lo recibe en `text`) */
export function enlaceWhatsapp(base: string, mensaje: string): string {
  return `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(mensaje)}`;
}
