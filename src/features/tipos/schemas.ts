import { z } from 'zod';

/** Hasta cuántos caracteres acepta el back en el nombre */
export const NOMBRE_TIPO_MAX = 40;

/** Cada tipo de GET /api/tipos, y lo que responden el alta y el renombre */
export const tipoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  /** Cuántos productos lo usan, activos y pausados */
  cantidadProductos: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** GET /api/tipos, por nombre */
export const tiposSchema = z.array(tipoSchema);

// ── Formulario ────────────────────────────────────────────────────────────────

/** Las mismas reglas que el back (los espacios de más no cuentan: el back los junta) */
export const formularioTipoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Escribí el nombre del tipo')
    .max(NOMBRE_TIPO_MAX, `El nombre puede tener hasta ${NOMBRE_TIPO_MAX} letras`),
});
