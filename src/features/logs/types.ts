import type { z } from 'zod';
import type {
  DIAS_LOGS,
  formularioNombreIpSchema,
  ipLogSchema,
  logSchema,
  MOTIVOS_SOSPECHA,
  NIVELES_LOG,
  paginaIpsSchema,
  paginaLogsSchema,
  paginaVisitasSchema,
  peticionVisitaSchema,
  resumenLogsSchema,
  visitaSchema,
} from './schemas';

export type NivelLog = (typeof NIVELES_LOG)[number];
export type MotivoSospecha = (typeof MOTIVOS_SOSPECHA)[number];
/** null = solo a mano */
export type DiasLogs = (typeof DIAS_LOGS)[number] | null;

export type ResumenLogs = z.infer<typeof resumenLogsSchema>;
export type Log = z.infer<typeof logSchema>;
export type PaginaLogs = z.infer<typeof paginaLogsSchema>;
export type PeticionVisita = z.infer<typeof peticionVisitaSchema>;
export type Visita = z.infer<typeof visitaSchema>;
export type PaginaVisitas = z.infer<typeof paginaVisitasSchema>;
export type IpLog = z.infer<typeof ipLogSchema>;
export type PaginaIps = z.infer<typeof paginaIpsSchema>;
export type FormularioNombreIp = z.input<typeof formularioNombreIpSchema>;

/** Los filtros de GET /api/logs. Lo que va en undefined no viaja */
export interface FiltrosLogs {
  nivel?: NivelLog;
  ip?: string;
  sospechosos?: boolean;
}
