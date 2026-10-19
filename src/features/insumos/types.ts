import type { z } from 'zod';
import type {
  formularioInsumoSchema,
  insumoConHistorialSchema,
  insumoSchema,
  logInsumoSchema,
  UNIDADES_INSUMO,
} from './schemas';

export type Insumo = z.infer<typeof insumoSchema>;
export type InsumoConHistorial = z.infer<typeof insumoConHistorialSchema>;
export type LogInsumo = z.infer<typeof logInsumoSchema>;
export type FormularioInsumo = z.infer<typeof formularioInsumoSchema>;
export type UnidadInsumo = (typeof UNIDADES_INSUMO)[number];

/** Lo que viaja a POST /api/insumos. En PUT /api/insumos/:id, solo lo que cambia */
export interface DatosInsumo {
  nombre: string;
  /** Pesos */
  precio: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** Cuánto vino, en su unidad. Obligatorias en el alta; en PUT, las dos juntas o ninguna */
  cantidad: number;
  unidad: UnidadInsumo;
}

/**
 * Cómo se abre el formulario: nuevo (alta), compra (una compra nueva: precio, cuánto vino y fecha, con hoy por
 * defecto) o corregir (arreglar un dato mal cargado: nombre, precio, cuánto vino o fecha)
 */
export type ModoFormularioInsumo = 'nuevo' | 'compra' | 'corregir';
