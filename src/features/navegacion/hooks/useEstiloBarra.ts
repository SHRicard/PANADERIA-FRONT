import { useAppDispatch, useAppSelector } from '@/store';
import { cambiarEstiloBarra, type EstiloBarra } from '../store/estiloBarraSlice';

/** El estilo de la barra de pestañas y cómo cambiarlo. Se guarda solo: sobrevive a cerrar la app */
export function useEstiloBarra(): { estilo: EstiloBarra; cambiarEstilo: (estilo: EstiloBarra) => void } {
  const estilo = useAppSelector((s) => s.estiloBarra.estilo);
  const dispatch = useAppDispatch();
  return { estilo, cambiarEstilo: (nuevo) => dispatch(cambiarEstiloBarra(nuevo)) };
}
