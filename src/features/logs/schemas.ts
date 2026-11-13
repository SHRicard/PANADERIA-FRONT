import { z } from 'zod';

// Las respuestas de /api/logs (docs/logs.md). Todo con token: solo lo ve el dueño

/** Cómo le fue a la petición: bien (2xx/3xx), un aviso (4xx) o un error (5xx o el cliente cortó) */
export const NIVELES_LOG = ['exito', 'aviso', 'error'] as const;

/** Por qué el back marcó una petición como sospechosa */
export const MOTIVOS_SOSPECHA = [
  'login-fallido',
  'recuperacion-fallida',
  'limite-superado',
  'sin-autorizacion',
  'ruta-inexistente',
  'origen-no-permitido',
] as const;

/** Cada cuántos días se borran solos. null = solo a mano */
export const DIAS_LOGS = [7, 15, 30] as const;

const nivelSchema = z.enum(NIVELES_LOG);
const motivoSchema = z.enum(MOTIVOS_SOSPECHA);
const cantidad = z.number().int().nonnegative();
const porNivelSchema = z.object({ exito: cantidad, aviso: cantidad, error: cantidad });
const diasLogsSchema = z.union([z.literal(7), z.literal(15), z.literal(30)]).nullable();

/** GET /api/logs/resumen: la cabecera de la pantalla */
export const resumenLogsSchema = z.object({
  /** El log más viejo guardado (ISO); null si no hay ninguno */
  desde: z.string().nullable(),
  total: cantidad,
  porNivel: porNivelSchema,
  /** IP distintas, sin contar las peticiones con el token del dueño */
  visitantes: cantidad,
  sospechosos: cantidad,
  /** Lo más pedido: el apartado es la ruta con los ids cambiados por :id (/api/catalogo/:id) */
  apartados: z.array(z.object({ metodo: z.string(), apartado: z.string(), peticiones: cantidad, ips: cantidad })),
  diasLogs: diasLogsSchema,
});

/** Una petición a la API */
export const logSchema = z.object({
  id: z.string(),
  /** ISO */
  fecha: z.string(),
  ip: z.string(),
  /** El nombre que le puso el dueño a esa IP */
  nombreIp: z.string().nullable(),
  metodo: z.string(),
  /** Sin la query */
  ruta: z.string(),
  apartado: z.string(),
  /** null: el cliente cortó antes de la respuesta */
  codigo: z.number().int().nullable(),
  nivel: nivelSchema,
  mensaje: z.string().nullable(),
  /** Cuánto tardó el back en responder */
  ms: z.number().nonnegative(),
  /** Con el token del dueño. Lo nuevo viene siempre en false (la app con sesión ya no se guarda); queda en los viejos */
  admin: z.boolean(),
  sospechoso: motivoSchema.nullable(),
  /** El pedido que se hizo con esta petición; null si no hubo o si ya no existe */
  pedido: z.object({ id: z.string(), clienteNombre: z.string().nullable() }).nullable(),
});

/** GET /api/logs: lo más nuevo primero */
export const paginaLogsSchema = z.object({
  logs: z.array(logSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalLogs: cantidad,
  totalPaginas: z.number().int(),
});

/** Una petición adentro de una visita: la IP ya la dice la visita */
export const peticionVisitaSchema = logSchema.omit({ ip: true, nombreIp: true, admin: true });

/**
 * Una visita: las peticiones de una IP juntas mientras no pasen 30 minutos sin actividad. Abrir la web son 3
 * peticiones a la vez; acá es 1 visita
 */
export const visitaSchema = z.object({
  ip: z.string(),
  nombreIp: z.string().nullable(),
  /** Los que hicieron un pedido en esta visita */
  clientes: z.array(z.string()),
  inicio: z.string(),
  fin: z.string(),
  duracionSegundos: cantidad,
  totalPeticiones: cantidad,
  porNivel: porNivelSchema,
  sospechosos: cantidad,
  /** Las primeras 50, en orden: totalPeticiones puede ser más */
  peticiones: z.array(peticionVisitaSchema),
});

/** GET /api/logs/visitas: la más reciente primero */
export const paginaVisitasSchema = z.object({
  visitas: z.array(visitaSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalVisitas: cantidad,
  totalPaginas: z.number().int(),
});

/** Una IP con todo lo que hizo */
export const ipLogSchema = z.object({
  ip: z.string(),
  nombre: z.string().nullable(),
  /** Los nombres de los que hicieron un pedido desde esta IP */
  clientes: z.array(z.string()),
  peticiones: cantidad,
  porNivel: porNivelSchema,
  sospechosos: cantidad,
  /** Alguna petición con el token del dueño */
  admin: z.boolean(),
  primera: z.string(),
  ultima: z.string(),
  /** Hasta 5, lo que más pidió primero */
  apartados: z.array(z.object({ metodo: z.string(), apartado: z.string(), peticiones: cantidad })),
});

/** GET /api/logs/ips: la que se vio último primero */
export const paginaIpsSchema = z.object({
  ips: z.array(ipLogSchema),
  pagina: z.number().int(),
  limite: z.number().int(),
  totalIps: cantidad,
  totalPaginas: z.number().int(),
});

/** PUT /api/logs/ips/:ip */
export const ipNombradaSchema = z.object({ ip: z.string(), nombre: z.string() });

/** GET y PUT /api/logs/borrado-automatico */
export const borradoAutomaticoSchema = z.object({ diasLogs: diasLogsSchema });

/** Lo mismo que valida el back: de 2 a 60 letras, sin contar los espacios de los bordes */
export const LARGO_NOMBRE_IP = { min: 2, max: 60 } as const;

export const formularioNombreIpSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(LARGO_NOMBRE_IP.min, `Escribí al menos ${LARGO_NOMBRE_IP.min} letras`)
    .max(LARGO_NOMBRE_IP.max, `Como mucho ${LARGO_NOMBRE_IP.max} letras`),
});
