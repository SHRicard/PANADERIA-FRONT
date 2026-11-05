import { z } from 'zod';
import { errorDeMultiplicador } from './precio';

/** En qué va cada ingrediente: gramos (lo que se pesa, también los líquidos) o unidades (los huevos) */
export const UNIDADES_RECETA = ['g', 'unidad'] as const;

/** Los límites del back */
export const RINDE_MAX = 10000;
export const INGREDIENTES_MAX = 50;
export const CANTIDAD_RECETA_MAX = 100000;
export const NOMBRE_INGREDIENTE_MAX = 60;

/** Lo que elige el Select de un ingrediente que no es un insumo (el agua). Los insumos van por su _id */
export const NO_SE_COMPRA = 'no-se-compra';

/** Cada ingrediente de la receta */
export const ingredienteRecetaSchema = z.object({
  /** El _id del insumo; null = algo que no se compra (el agua) */
  insumo: z.string().nullable(),
  /** El del insumo (si lo renombran, cambia acá) o el que se escribió */
  nombre: z.string(),
  /** Siempre entero */
  cantidad: z.number().int(),
  unidad: z.enum(UNIDADES_RECETA),
  /** Lo que cuesta con el último precio del insumo; 0 si no se compra; null si no se puede calcular */
  costo: z.number().nullable(),
});

/** GET y PUT /api/recetas/:productoId (y PUT …/precio) */
export const recetaSchema = z.object({
  /** `precio`: el de venta de hoy, para compararlo con lo que cuesta hacerlo */
  producto: z.object({ _id: z.string(), nombre: z.string(), precio: z.number() }),
  /** Cuántas unidades salen */
  rinde: z.number().int(),
  ingredientes: z.array(ingredienteRecetaSchema),
  costoTotal: z.number().nullable(),
  costoPorUnidad: z.number().nullable(),
  /** El último con el que se le puso el precio desde la receta; null si nunca */
  multiplicador: z.number().nullable(),
  /** El redondeo que usó esa vez (10, 50, 100, 500 o 1000); null si lo dejó al peso o nunca */
  redondeo: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** GET /api/recetas/:productoId/produccion?unidades=24: cuánto hace falta de cada ingrediente para hacer esas unidades */
export const produccionSchema = z.object({
  producto: recetaSchema.shape.producto,
  rinde: z.number().int(),
  /** Las que se pidieron */
  unidades: z.number().int(),
  /** Cuántas veces la receta: 24 de una receta de 12 = 2; 25 = 2.08 (con dos decimales) */
  veces: z.number(),
  ingredientes: z.array(
    ingredienteRecetaSchema.extend({
      /** No daba justo y se redondeó para arriba (7,5 huevos → 8) */
      redondeado: z.boolean(),
    })
  ),
  /** Lo que cuestan esas cantidades con el último precio de cada insumo; null si alguno no se puede calcular */
  costoTotal: z.number().nullable(),
});

// ── Formulario ────────────────────────────────────────────────────────────────

const entero = (max: number, vacio: string) =>
  z
    .string()
    .trim()
    .min(1, vacio)
    .regex(/^\d+$/, 'Solo números enteros, sin puntos ni comas')
    .refine((valor) => Number(valor) >= 1, 'Tiene que ser 1 o más')
    .refine((valor) => Number(valor) <= max, `Puede ser hasta ${max}`);

/** Un ingrediente como se escribe. `eleccion` es el _id del insumo, NO_SE_COMPRA o '' (todavía nada) */
const ingredienteFormularioSchema = z
  .object({
    eleccion: z.string().min(1, 'Elegí un insumo'),
    nombre: z.string(),
    unidad: z.enum(UNIDADES_RECETA),
    cantidad: entero(CANTIDAD_RECETA_MAX, 'Escribí cuánto lleva'),
  })
  .superRefine((ingrediente, ctx) => {
    if (ingrediente.eleccion !== NO_SE_COMPRA) return;
    const largo = ingrediente.nombre.trim().length;
    if (largo < 2) ctx.addIssue({ code: 'custom', path: ['nombre'], message: 'Escribí qué es (por ejemplo, Agua)' });
    if (largo > NOMBRE_INGREDIENTE_MAX) {
      ctx.addIssue({ code: 'custom', path: ['nombre'], message: `Puede tener hasta ${NOMBRE_INGREDIENTE_MAX} letras` });
    }
  });

/** Las mismas reglas que el back. Los números llegan como texto; el hook los convierte al enviar */
export const formularioRecetaSchema = z.object({
  rinde: entero(RINDE_MAX, 'Escribí cuántas unidades salen'),
  ingredientes: z
    .array(ingredienteFormularioSchema)
    .min(1, 'Agregá al menos un ingrediente')
    .max(INGREDIENTES_MAX, `Puede tener hasta ${INGREDIENTES_MAX} ingredientes`)
    // El mismo insumo dos veces: el back lo rechaza. Se marca en la fila repetida
    .superRefine((ingredientes, ctx) => {
      const vistos = new Set<string>();
      ingredientes.forEach(({ eleccion }, indice) => {
        if (!eleccion || eleccion === NO_SE_COMPRA) return;
        if (vistos.has(eleccion)) {
          ctx.addIssue({ code: 'custom', path: [indice, 'eleccion'], message: 'Ya está en la receta: sumá las cantidades en uno' });
        }
        vistos.add(eleccion);
      });
    }),
});

// ── Precio desde la receta ──────────────────────────────────────────────────

/** Los que se eligen de un toque; cualquier otro (×5, ×2,5) se escribe en «Otro» */
export const MULTIPLICADORES_RAPIDOS = ['2', '3', '4'] as const;
export const OTRO_MULTIPLICADOR = 'otro';
export const ELECCIONES_MULTIPLICADOR = [...MULTIPLICADORES_RAPIDOS, OTRO_MULTIPLICADOR] as const;

/** Sin redondear, el redondeo más cercano ($ 11.700) o el más redondo ($ 12.000): los precios cambian con el multiplicador */
export const ELECCIONES_REDONDEO = ['no', 'cerca', 'redondo'] as const;

/** Lo que se elige en el Segmentado y, con «Otro», lo que se escribe. Las mismas reglas que el back */
export const formularioPrecioSchema = z
  .object({
    eleccion: z.enum(ELECCIONES_MULTIPLICADOR),
    otro: z.string(),
    redondeo: z.enum(ELECCIONES_REDONDEO),
  })
  .superRefine(({ eleccion, otro }, ctx) => {
    if (eleccion !== OTRO_MULTIPLICADOR) return;
    const error = errorDeMultiplicador(otro);
    if (error) ctx.addIssue({ code: 'custom', path: ['otro'], message: error });
  });
