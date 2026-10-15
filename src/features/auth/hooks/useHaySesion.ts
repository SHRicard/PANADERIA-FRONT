import { useAppSelector } from '@/store';

/** Si hay un token guardado. Lo usa el guard del layout de (admin) */
export function useHaySesion(): boolean {
  return useAppSelector((s) => s.sesion.token !== null);
}
