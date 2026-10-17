import type { z } from 'zod';
import type { datosPagoSchema, formularioDatosPagoSchema } from './schemas';

export type DatosPago = z.infer<typeof datosPagoSchema>;
/** Lo que escribe el dueño (antes de validar) */
export type FormularioDatosPago = z.input<typeof formularioDatosPagoSchema>;
