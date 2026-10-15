import { z } from 'zod';

// ── Respuestas de la API ──────────────────────────────────────────────────────

export const tokenRespuestaSchema = z.object({ token: z.string().min(1) });

export const recuperarRespuestaSchema = z.object({ mensaje: z.string() });

// ── Formularios ───────────────────────────────────────────────────────────────

// Los mismos límites que valida el back (bcrypt ignora lo que pase de 72)
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const loginSchema = z.object({
  usuario: z.string().trim().min(1, 'Ingresá tu usuario'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

export const recuperarSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Ingresá un email válido')),
});

export const restablecerSchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'El código tiene 6 números'),
    password: z
      .string()
      .min(PASSWORD_MIN, `Tiene que tener al menos ${PASSWORD_MIN} caracteres`)
      .max(PASSWORD_MAX, `Puede tener hasta ${PASSWORD_MAX} caracteres`),
    confirmacion: z.string().min(1, 'Repetí la contraseña'),
  })
  .refine((datos) => datos.password === datos.confirmacion, {
    path: ['confirmacion'],
    error: 'Las contraseñas no coinciden',
  });
