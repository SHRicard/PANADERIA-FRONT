import type { LucideIcon } from 'lucide-react-native';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react-native';
import type { BadgeTone, OpcionSegmentado, OpcionSelect } from '@/shared/ui/atoms';
import type { ColorToken } from '@/theme';
import type { DiasLogs, FiltrosLogs, Log, MotivoSospecha, NivelLog } from './types';

/** Cómo se muestra cada nivel: la palabra, el color y el ícono (así no depende solo del color) */
export const NIVEL: Record<NivelLog, { label: string; plural: string; tono: BadgeTone; color: ColorToken; icono: LucideIcon }> = {
  exito: { label: 'Bien', plural: 'bien', tono: 'success', color: 'success', icono: CircleCheck },
  aviso: { label: 'Aviso', plural: 'avisos', tono: 'warning', color: 'warning', icono: TriangleAlert },
  error: { label: 'Error', plural: 'errores', tono: 'danger', color: 'danger', icono: CircleX },
};

/** Por qué es sospechosa, en palabras (docs/logs.md) */
export const MOTIVO_SOSPECHA: Record<MotivoSospecha, string> = {
  'login-fallido': 'Contraseña incorrecta',
  'recuperacion-fallida': 'Probó la recuperación de contraseña',
  'limite-superado': 'Demasiadas peticiones',
  'sin-autorizacion': 'Quiso entrar a lo privado',
  'ruta-inexistente': 'Buscó rutas que no existen',
  'origen-no-permitido': 'Desde otra web',
};

// ── Los apartados ─────────────────────────────────────────────────────────────

/** El primer pedazo de la ruta después de /api, en palabras. Lo que no está acá se muestra como viene */
const NOMBRES_APARTADO: Record<string, string> = {
  catalogo: 'Catálogo',
  carrito: 'Carrito',
  pedidos: 'Pedidos',
  auth: 'Inicio de sesión',
  productos: 'Productos',
  promos: 'Promos',
  clientes: 'Clientes',
  ajustes: 'Ajustes',
  'datos-pago': 'Datos de pago',
  insumos: 'Insumos',
  tipos: 'Tipos',
  recetas: 'Recetas',
  almacenamiento: 'Memoria',
  metricas: 'Métricas',
  resumen: 'Resumen',
  agenda: 'Agenda',
  logs: 'Logs',
};

/** "/api/catalogo/:id" → "Catálogo"; una ruta que no es de la API ("/wp-admin") → null */
export function nombreApartado(apartado: string): string | null {
  const [, api, seccion] = apartado.split('/');
  if (api !== 'api' || !seccion) return null;
  return NOMBRES_APARTADO[seccion] ?? null;
}

/** "GET /api/catalogo/:id" */
export const rutaConMetodo = (metodo: string, ruta: string) => `${metodo} ${ruta}`;

// ── Fechas ────────────────────────────────────────────────────────────────────

// En la hora de Argentina, como el resto de la app
const ZONA = 'America/Argentina/Buenos_Aires';
const formatoDia = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', timeZone: ZONA });
const formatoDiaCorto = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', timeZone: ZONA });
const formatoHora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: ZONA });
const formatoHoraCorta = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: ZONA });

/** "13/11 · 16:03:12" */
export const fechaLog = (iso: string) => `${formatoDiaCorto.format(new Date(iso))} · ${formatoHora.format(new Date(iso))}`;

/** "13/11 16:03" */
export const fechaCorta = (iso: string) => `${formatoDiaCorto.format(new Date(iso))} ${formatoHoraCorta.format(new Date(iso))}`;

/** "13/11 · 16:03 a 16:10"; si empezó y terminó en el mismo minuto, solo la hora */
export function rangoVisita(inicio: string, fin: string): string {
  const desde = formatoHoraCorta.format(new Date(inicio));
  const hasta = formatoHoraCorta.format(new Date(fin));
  return `${formatoDiaCorto.format(new Date(inicio))} · ${desde === hasta ? desde : `${desde} a ${hasta}`}`;
}

/** Cuánto duró una visita: "Un momento", "45 s", "12 min", "1 h 20 min" */
export function textoDuracionVisita(segundos: number): string {
  if (segundos < 1) return 'Un momento';
  if (segundos < 60) return `${segundos} s`;
  const minutos = Math.round(segundos / 60);
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

/** "16:03:12" */
export const horaLog = (iso: string) => formatoHora.format(new Date(iso));

/** "Desde el 3 de noviembre"; sin logs, null */
export const textoDesde = (desde: string | null) => (desde ? `Desde el ${formatoDia.format(new Date(desde))}` : null);

// ── Números ───────────────────────────────────────────────────────────────────

const entero = new Intl.NumberFormat('es-AR');

/** 1234 → "1.234" */
export const formatearNumero = (n: number) => entero.format(n);

/** "1 petición", "1.234 peticiones" */
export const textoPeticiones = (n: number) => `${formatearNumero(n)} ${n === 1 ? 'petición' : 'peticiones'}`;

/** "1 visita", "12 visitas" */
export const textoVisitas = (n: number) => `${formatearNumero(n)} ${n === 1 ? 'visita' : 'visitas'}`;

/** "1 IP", "3 IP" */
export const textoIps = (n: number) => `${formatearNumero(n)} IP`;

/** 85 → "85 ms"; 2300 → "2,3 s" */
export const textoDuracion = (ms: number) =>
  ms >= 1000 ? `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(ms / 1000)} s` : `${Math.round(ms)} ms`;

/** El código HTTP; sin código, el cliente cortó antes de la respuesta */
export const textoCodigo = (codigo: number | null) => (codigo === null ? 'Cortó' : String(codigo));

// ── Quién es ──────────────────────────────────────────────────────────────────

/** El nombre que le puso el dueño o la IP */
export const quienEs = (log: Pick<Log, 'nombreIp' | 'ip'>) => log.nombreIp ?? log.ip;

/** Los que hicieron un pedido desde esa IP o en esa visita: "Pidió como: María, Juan" */
export const textoClientes = ({ clientes }: { clientes: string[] }) => (clientes.length ? `Pidió como: ${clientes.join(', ')}` : null);

/** El nombre que le puso el dueño a una IP o la IP; con nombre, la IP al lado: "Juan (190.1.2.3)" */
export const nombreConIp = (ip: string, nombre: string | null) => (nombre ? `${nombre} (${ip})` : ip);

// ── Filtros ───────────────────────────────────────────────────────────────────

/**
 * Qué peticiones mostrar. Junta en un solo Select los filtros de nivel y sospechosos. Sin filtro de admin: lo que
 * hace la app con sesión ya no se guarda (docs/logs.md), así que todo es de la parte pública
 */
export type FiltroPeticiones = 'todas' | 'sospechosas' | 'error' | 'aviso' | 'exito';

export const FILTROS_PETICIONES: readonly OpcionSelect<FiltroPeticiones>[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'sospechosas', label: 'Sospechosas' },
  { valor: 'error', label: 'Con error' },
  { valor: 'aviso', label: 'Con aviso' },
  { valor: 'exito', label: 'Bien' },
];

/** El filtro elegido, como lo pide el back */
export function filtrosDe(filtro: FiltroPeticiones, ip: string | null): FiltrosLogs {
  const base: FiltrosLogs = ip ? { ip } : {};
  switch (filtro) {
    case 'sospechosas':
      return { ...base, sospechosos: true };
    case 'error':
    case 'aviso':
    case 'exito':
      return { ...base, nivel: filtro };
    default:
      return base;
  }
}

/** Las tres vistas de la pantalla. Abre en visitas: abrir la web son varias peticiones a la vez, y ahí es una sola */
export type VistaLogs = 'visitas' | 'peticiones' | 'ips';

export const VISTAS_LOGS: readonly OpcionSegmentado<VistaLogs>[] = [
  { valor: 'visitas', label: 'Visitas' },
  { valor: 'peticiones', label: 'Peticiones' },
  { valor: 'ips', label: 'IP' },
];

/** El filtro de las visitas y de las IP */
export type FiltroSospecha = 'todas' | 'sospechosas';

export const FILTROS_SOSPECHA: readonly OpcionSegmentado<FiltroSospecha>[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'sospechosas', label: 'Sospechosas' },
];

// ── Borrado automático ────────────────────────────────────────────────────────

/** El Select no acepta null: «manual» es solo a mano */
export type OpcionBorrado = 'manual' | '7' | '15' | '30';

export const OPCIONES_BORRADO: readonly OpcionSelect<OpcionBorrado>[] = [
  { valor: '7', label: 'Cada semana' },
  { valor: '15', label: 'Cada 15 días' },
  { valor: '30', label: 'Cada mes' },
  { valor: 'manual', label: 'Solo a mano' },
];

export const opcionDeDias = (dias: DiasLogs): OpcionBorrado => (dias === null ? 'manual' : (String(dias) as OpcionBorrado));

export const diasDeOpcion = (opcion: OpcionBorrado): DiasLogs => (opcion === 'manual' ? null : (Number(opcion) as 7 | 15 | 30));
