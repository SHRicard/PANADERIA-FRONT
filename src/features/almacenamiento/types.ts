import type { z } from 'zod';
import type { archivoAlmacenadoSchema, NIVELES_USO, ORIGENES_ARCHIVO, paginaArchivosSchema, usoCloudinarySchema } from './schemas';

export type UsoCloudinary = z.infer<typeof usoCloudinarySchema>;
export type NivelUso = (typeof NIVELES_USO)[number];

export type ArchivoAlmacenado = z.infer<typeof archivoAlmacenadoSchema>;
export type PaginaArchivos = z.infer<typeof paginaArchivosSchema>;
export type OrigenArchivo = (typeof ORIGENES_ARCHIVO)[number];
