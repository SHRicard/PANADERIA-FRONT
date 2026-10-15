import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ESTILOS_BARRA } from '../estilosBarra';
import { useEstiloBarra } from '../hooks/useEstiloBarra';
import { armarPestanas } from '../pestanas';

/** La barra de pestañas del admin: conecta el navegador con el estilo que eligió el dueño en Más → Preferencias */
export function BarraPestanas(props: BottomTabBarProps) {
  const { estilo } = useEstiloBarra();
  const { Barra } = ESTILOS_BARRA[estilo];
  return <Barra pestanas={armarPestanas(props)} margenInferior={props.insets.bottom} />;
}
