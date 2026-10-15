import { z } from 'zod';

// Lo que trae el token del back: { id, usuario, iat, exp }. Acá solo interesa el usuario
const payloadSchema = z.object({ usuario: z.string().min(1) });

/**
 * El usuario que dice el token, para mostrarlo (la tarjeta de Más). No verifica la firma ni el vencimiento:
 * eso lo hace el back en cada pedido. Si el token no se puede leer, devuelve null
 */
export function usuarioDelToken(token: string): string | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const conRelleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    // atob devuelve bytes: se pasan por UTF-8 para que un usuario con tilde o ñ se lea bien
    const bytes = Array.from(atob(conRelleno), (letra) => `%${letra.charCodeAt(0).toString(16).padStart(2, '0')}`);
    const resultado = payloadSchema.safeParse(JSON.parse(decodeURIComponent(bytes.join(''))));
    return resultado.success ? resultado.data.usuario : null;
  } catch {
    return null;
  }
}
