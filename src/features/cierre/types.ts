import type { ReactNode } from 'react';
import type { z } from 'zod';
import type { formularioCierreSchema } from './schemas';

export type FormularioCierre = z.infer<typeof formularioCierreSchema>;

/** Lo que recibe el cartel: el mismo en la web y en la vista previa del dueño */
export interface CartelProps {
  /** Lo que escribió el dueño, o el de por defecto (`mensajeParaMostrar`) */
  mensaje: string;
  /** Lo que va abajo de todo: en la web, el botón para escribirle por WhatsApp. En la vista previa, nada */
  pie?: ReactNode;
}
