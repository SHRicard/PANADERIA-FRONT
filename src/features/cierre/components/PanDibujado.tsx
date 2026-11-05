import { G, Path } from 'react-native-svg';
import { useTheme } from '@/theme';

// El pan y la medialuna de la vidriera del loader (atom Cargando), en una casilla de 50 × 50 apoyados en y = 43.
// Acá van quietos, en las ventanas del cartel de negocio cerrado
const PAN = 'M9 41 C9 25 41 25 41 41 Q41 42.5 39 42.5 L11 42.5 Q9 42.5 9 41 Z';
const PAN_CORTES = 'M19 31 l3 4.4 M26.5 29.5 l3 4.6';
const PAN_BRILLO = 'M13 36 C14 32 17 30 20.5 29.4';
const MEDIALUNA = 'M6 41 C9 24 41 24 44 41 C38 37 12 37 6 41 Z';
const MEDIALUNA_CAPAS = 'M17.5 39 Q16 35 16.8 31 M25 38.6 Q24 33 25 28.6 M32.5 39 Q34 35 33.2 31';

export type CualPan = 'pan' | 'medialuna';

interface PanDibujadoProps {
  cual: CualPan;
  /** Dónde va la esquina de arriba a la izquierda de la casilla, en unidades del dibujo que lo contiene */
  x: number;
  y: number;
  escala?: number;
  /** Con la luz apagada (`theme.opacity.apagado`), en las ventanas del local cerrado */
  apagado?: boolean;
}

/** Un pan o una medialuna, para poner adentro de un `<Svg>` */
export function PanDibujado({ cual, x, y, escala = 1, apagado = false }: PanDibujadoProps) {
  const theme = useTheme();
  const { pan, panCorte, panBrillo } = theme.colors;

  return (
    <G transform={`translate(${x} ${y}) scale(${escala})`} opacity={apagado ? theme.opacity.apagado : 1}>
      {cual === 'pan' ? (
        <>
          <Path d={PAN} fill={pan} />
          <Path d={PAN_BRILLO} fill="none" stroke={panBrillo} strokeWidth={1.4} strokeLinecap="round" />
          <Path d={PAN_CORTES} fill="none" stroke={panCorte} strokeWidth={1.6} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path d={MEDIALUNA} fill={pan} stroke={panCorte} strokeWidth={1.2} strokeLinejoin="round" />
          <Path d={MEDIALUNA_CAPAS} fill="none" stroke={panCorte} strokeWidth={1.2} strokeLinecap="round" />
        </>
      )}
    </G>
  );
}
