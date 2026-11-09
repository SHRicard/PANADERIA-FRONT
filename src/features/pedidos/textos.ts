import { Car, Store } from 'lucide-react-native';
import type { BadgeTone, OpcionSegmentado } from '@/shared/ui/atoms';
import { formatearFecha, formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import type { DetallePedido, EstadoPedido, Pedido } from './types';

/** Cómo se ve cada estado */
export const ESTADO: Record<EstadoPedido, { label: string; tone: BadgeTone }> = {
  pendiente: { label: 'Esperando la seña', tone: 'warning' },
  confirmado: { label: 'Seña pagada', tone: 'primary' },
  entregado: { label: 'Entregado', tone: 'success' },
  cancelado: { label: 'Cancelado', tone: 'neutral' },
};

/** Confirmado con seña 0: el dueño lo confirmó sin seña. No dice «Seña pagada» */
const SIN_SENA: { label: string; tone: BadgeTone } = { label: 'Sin seña', tone: 'primary' };

/**
 * La etiqueta del estado de un pedido: como `ESTADO`, pero el confirmado sin seña dice «Sin seña». Los contadores por
 * estado (inicio, métricas) siguen con `ESTADO`: el back cuenta los sin seña como confirmados
 */
export function estadoDe(pedido: Pick<Pedido, 'estado' | 'sena'>): { label: string; tone: BadgeTone } {
  return pedido.estado === 'confirmado' && pedido.sena?.monto === 0 ? SIN_SENA : ESTADO[pedido.estado];
}

/** Los pedidos que cargó el dueño llevan esta marca en la lista y en el detalle */
export const MARCA_MANUAL = 'Cargado a mano';

/** La marca de un pedido de la web que el dueño todavía no vio */
export const MARCA_NUEVO = 'Nuevo';

/** Cómo lo recibe el cliente: va en la lista y en el detalle, para saber de un vistazo si hay que mandarlo */
export function marcaEnvio(conEnvio: boolean): { label: string; tone: BadgeTone } {
  return conEnvio ? { label: 'Con envío', tone: 'warning' } : { label: 'Retira', tone: 'neutral' };
}

/** El selector del envío del pedido manual (lo que pidió el cliente por WhatsApp). El pedido guarda `conEnvio`: 'envio' es true */
export type Entrega = 'retiro' | 'envio';
export const OPCIONES_ENTREGA: OpcionSegmentado<Entrega>[] = [
  { valor: 'retiro', label: 'Retira', icono: Store },
  { valor: 'envio', label: 'Con envío', icono: Car },
];

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

/**
 * El aviso de que el pedido está listo: qué pidió y cuánto le falta pagar (o que ya está pago). Con envío, que en
 * un rato se lo llevan; si no, que lo pase a retirar
 */
export function mensajeListo(pedido: DetallePedido): string {
  const { conEnvio, saldo } = pedido;
  const nombre = primerNombre(pedido);
  const productos = pedido.items.map(({ cantidad, nombre }) => `• ${cantidad} × ${nombreParaMostrar(nombre)}`);
  const pago = conEnvio ? 'Ya está todo pago.' : 'Ya está todo pago: solo tenés que pasar a buscarlo.';
  const cobro = saldo > 0 ? `Al ${conEnvio ? 'recibirlo' : 'retirarlo'} te queda por pagar ${formatearPrecio(saldo)}.` : pago;
  return [
    `¡Hola${nombre ? ` ${nombre}` : ''}! Tu pedido ya está listo${conEnvio ? ' y en un rato te lo llevamos' : ' para retirar'}:`,
    ...productos,
    cobro,
    conEnvio ? '¡Gracias! Dama Blanca' : '¡Te esperamos! Dama Blanca',
  ].join('\n');
}
