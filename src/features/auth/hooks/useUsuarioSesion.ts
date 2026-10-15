import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { usuarioDelToken } from '../token';

/** El usuario con el que se entró, sacado del token. null si no hay sesión o no se puede leer */
export function useUsuarioSesion(): string | null {
  const token = useAppSelector((s) => s.sesion.token);
  return useMemo(() => (token ? usuarioDelToken(token) : null), [token]);
}
