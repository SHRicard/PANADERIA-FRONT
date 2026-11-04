import type { z } from 'zod';
import type {
  formularioPrecioSchema,
  formularioRecetaSchema,
  ingredienteRecetaSchema,
  produccionSchema,
  recetaSchema,
  UNIDADES_RECETA,
} from './schemas';

export type Receta = z.infer<typeof recetaSchema>;
export type IngredienteReceta = z.infer<typeof ingredienteRecetaSchema>;
export type Produccion = z.infer<typeof produccionSchema>;
export type UnidadReceta = (typeof UNIDADES_RECETA)[number];
export type FormularioReceta = z.infer<typeof formularioRecetaSchema>;
export type FormularioPrecio = z.infer<typeof formularioPrecioSchema>;
export type EleccionMultiplicador = FormularioPrecio['eleccion'];
export type EleccionRedondeo = FormularioPrecio['redondeo'];

/** Lo que muestra la hoja que confirma el precio nuevo. Se arma al tocar «Actualizar precio» y no cambia mientras está abierta */
export interface ConfirmacionPrecio {
  /** El de hoy */
  actual: number;
  /** El que va a quedar */
  nuevo: number;
  /** Lo que cuesta cada unidad × el multiplicador, antes de redondear */
  exacto: number;
  costo: number;
  multiplicador: number;
  /** A qué múltiplo se redondea para arriba; null si queda al peso */
  redondeo: number | null;
}

/** Lo que viaja en PUT /api/recetas/:productoId. La unidad de un insumo la pone el back (según el insumo) */
export interface DatosReceta {
  rinde: number;
  ingredientes: ({ insumo: string; cantidad: number } | { nombre: string; unidad: UnidadReceta; cantidad: number })[];
}
