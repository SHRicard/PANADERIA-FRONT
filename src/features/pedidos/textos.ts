import type { BadgeTone } from '@/shared/ui/atoms';
import { formatearFecha, formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import type { DetallePedido, EstadoPedido } from './types';

/** Cómo se ve cada estado */
export const ESTADO: Record<EstadoPedido, { label: string; tone: BadgeTone }> = {
  pendiente: { label: 'Esperando la seña', tone: 'warning' },
  confirmado: { label: 'Seña pagada', tone: 'primary' },
  entregado: { label: 'Entregado', tone: 'success' },
  cancelado: { label: 'Cancelado', tone: 'neutral' },
};

const hora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** "2026-10-16T21:08:13.392Z" → "viernes 16 de octubre, 18:08" (en la hora del celular) */
export function fechaYHora(iso: string): string {
  const fecha = new Date(iso);
  return `${formatearFecha(fecha)}, ${hora.format(fecha)}`;
}

/** 1 → "1 producto"; 5 → "5 productos" (contando las unidades) */
export function textoUnidades(cantidad: number): string {
  return cantidad === 1 ? '1 producto' : `${cantidad} productos`;
}

/**
 * Para escribirle al cliente: el back guarda el teléfono en E.164 (+5491155551234). Con `mensaje`, el chat
 * abre con el texto ya escrito (wa.me lo recibe en `text`) y el dueño solo lo manda
 */
export function linkWhatsApp(telefono: string, mensaje?: string): string {
  const link = `https://wa.me/${telefono.replace(/\D/g, '')}`;
  return mensaje ? `${link}?text=${encodeURIComponent(mensaje)}` : link;
}

const primerNombre = (pedido: DetallePedido) => pedido.clienteNombre.trim().split(/\s+/)[0];

/** «Escribirle por WhatsApp»: un saludo para arrancar la charla, sin nada del pedido */
export function mensajeSaludo(pedido: DetallePedido): string {
  const nombre = primerNombre(pedido);
  return `¡Hola${nombre ? ` ${nombre}` : ''}! ¿Cómo estás? Te escribo de Dama Blanca por tu pedido.`;
}

/** El aviso de que el pedido está listo para retirar: qué pidió y cuánto le falta pagar (o que ya está pago) */
export function mensajeListo(pedido: DetallePedido): string {
  const nombre = primerNombre(pedido);
  const productos = pedido.items.map(({ cantidad, nombre }) => `• ${cantidad} × ${nombreParaMostrar(nombre)}`);
  const cobro =
    pedido.saldo > 0
      ? `Al retirarlo te queda por pagar ${formatearPrecio(pedido.saldo)}.`
      : 'Ya está todo pago: solo tenés que pasar a buscarlo.';
  return [
    `¡Hola${nombre ? ` ${nombre}` : ''}! Tu pedido ya está listo para retirar:`,
    ...productos,
    cobro,
    '¡Te esperamos! Dama Blanca',
  ].join('\n');
}
