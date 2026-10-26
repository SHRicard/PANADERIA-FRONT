import type { z } from 'zod';
import type { resumenSchema } from './schemas';

export type Resumen = z.infer<typeof resumenSchema>;
