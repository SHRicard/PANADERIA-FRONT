import { useAppDispatch, useAppSelector } from '@/store';
import { cambiarEstiloEncabezado, type EstiloEncabezado } from '../store/estiloEncabezadoSlice';

/** El estilo del encabezado de las pestañas y cómo cambiarlo. Se guarda solo: sobrevive a cerrar la app */
export function useEstiloEncabezado(): { estilo: EstiloEncabezado; cambiarEstilo: (estilo: EstiloEncabezado) => void } {
  const estilo = useAppSelector((s) => s.estiloEncabezado.estilo);
  const dispatch = useAppDispatch();
  return { estilo, cambiarEstilo: (nuevo) => dispatch(cambiarEstiloEncabezado(nuevo)) };
}
