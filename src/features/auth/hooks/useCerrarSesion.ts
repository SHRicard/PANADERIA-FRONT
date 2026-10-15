import { useAppDispatch } from '@/store';
import { cerrarSesion } from '../store/sesionSlice';

/** Borra el token. El layout de (admin) ve que no hay sesión y vuelve al login */
export function useCerrarSesion(): () => void {
  const dispatch = useAppDispatch();
  return () => dispatch(cerrarSesion());
}
