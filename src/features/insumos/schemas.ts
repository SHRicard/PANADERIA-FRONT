import { z } from 'zod';
import { deEscrita, hoy } from './fechas';

export const CAMPOS_INSUMO = ['nombre', 'precio', 'fecha', 'cantidad', 'unidad'] as const;

/** En qué se mide lo que vino en la compra: 25 kg de harina, 5 l de leche, 30 huevos */
export const UNIDADES_INSUMO = ['kg', 'l', 'unidad'] as const;
/** Hasta cuánto acepta el back */
export const CANTIDAD_INSUMO_MAX = 100000;

/** Cuánto vino en la compra. Las cargadas antes de que existiera no lo tienen (van juntas: las dos o ninguna) */
const tamano = { cantidad: z.number().positive().optional(), unidad: z.enum(UNIDADES_INSUMO).optional() };

/** Una entrada del historial: cómo quedó el insumo después del alta o de una actualización */
export const logInsumoSchema = z.object({
  id: z.string(),
  accion: z.enum(['creacion', 'actualizacion']),
  nombre: z.string(),
  precio: z.number(),
  /** El día de la compra, AAAA-MM-DD */
  fecha: z.string(),
  ...tamano,
  /** Qué cambió respecto de la entrada anterior. En el alta, vacío */
  cambios: z.array(z.enum(CAMPOS_INSUMO)),
  /** Cuándo se cargó en la app (no es el día de la compra) */
  registradoEn: z.string(),
});

/** Cada insumo de GET /api/insumos: sin el historial */
export const insumoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  /** Lo que pagó en la última compra */
  precio: z.number().positive(),
  /** El día de la última compra, AAAA-MM-DD */
  fecha: z.string(),
  ...tamano,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** GET /api/insumos, por nombre */
export const insumosSchema = z.array(insumoSchema);

/** GET /api/insumos/:id, y lo que responden el alta y la actualización: con el historial, la entrada más nueva primero */
export const insumoConHistorialSchema = insumoSchema.extend({
  logs: z.array(logInsumoSchema),
});

// ── Formulario ────────────────────────────────────────────────────────────────

/** Hasta cuántos caracteres acepta el back en el nombre */
export const NOMBRE_INSUMO_MAX = 60;

/** Las mismas reglas que el back. Los campos llegan como texto; el hook los convierte al enviar */
export const formularioInsumoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Escribí el nombre del insumo')
    .max(NOMBRE_INSUMO_MAX, `El nombre puede tener hasta ${NOMBRE_INSUMO_MAX} letras`),
  // Pesos enteros: con decimales, "1.500" se confunde entre mil quinientos y uno coma cinco
  precio: z
    .string()
    .trim()
    .min(1, 'Escribí cuánto pagaste')
    .regex(/^\d+$/, 'Solo números, sin puntos ni comas')
    .refine((valor) => Number(valor) > 0, 'Tiene que ser mayor que 0'),
  // Con decimales (0,5 kg de levadura): coma o punto, hasta 3 decimales
  cantidad: z
    .string()
    .trim()
    .min(1, 'Escribí cuánto vino')
    .regex(/^\d+([.,]\d{1,3})?$/, 'Solo números: 25, o 0,5')
    .refine((valor) => Number(valor.replace(',', '.')) > 0, 'Tiene que ser mayor que 0')
    .refine((valor) => Number(valor.replace(',', '.')) <= CANTIDAD_INSUMO_MAX, `Puede ser hasta ${CANTIDAD_INSUMO_MAX}`),
  unidad: z.enum(UNIDADES_INSUMO),
  /** DD/MM/AAAA, como se escribe acá */
  fecha: z
    .string()
    .trim()
    .refine((valor) => deEscrita(valor) !== null, 'Escribí la fecha así: 15/10/2026')
    .refine((valor) => (deEscrita(valor) ?? '') <= hoy(), 'No puede ser posterior a hoy'),
});
