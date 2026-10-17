import type { z } from 'zod';
import type { formularioInsumoSchema, insumoConHistorialSchema, insumoSchema, logInsumoSchema } from './schemas';

export type Insumo = z.infer<typeof insumoSchema>;
export type InsumoConHistorial = z.infer<typeof insumoConHistorialSchema>;
export type LogInsumo = z.infer<typeof logInsumoSchema>;
export type FormularioInsumo = z.infer<typeof formularioInsumoSchema>;

/** Lo que viaja a POST /api/insumos. En PUT /api/insumos/:id, solo lo que cambia */
export interface DatosInsumo {
  nombre: string;
  /** Pesos */
  precio: number;
  /** AAAA-MM-DD */
  fecha: string;
}

/**
 * Cómo se abre el formulario: nuevo (alta), compra (una compra nueva: precio y fecha, con hoy por defecto) o
 * corregir (arreglar un dato mal cargado: nombre, precio o fecha)
 */
export type ModoFormularioInsumo = 'nuevo' | 'compra' | 'corregir';
