import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { TemaAnidado } from '@/theme';
import { useEstiloCatalogo } from '../hooks/useEstiloCatalogo';
import { TEMAS_CATALOGO } from '../temas';
import { NieveNavidad } from './navidad/NieveNavidad';

interface TemaCatalogoProps {
  /** Las pantallas públicas (el Stack de la web) */
  children: ReactNode;
}

/**
 * Pinta la web pública con el tema del estilo que eligió el dueño, si es de temporada (Navidad): el catálogo, el
 * detalle y el pedido cambian de colores y letras sin tocar esas pantallas, y cae nieve en todas. La nieve va como
 * `fondo` del tema: cada `ScreenContainer` la dibuja detrás de su contenido (no por encima: tapaba textos y botones, y
 * caía sobre el velo de las hojas). Va adentro de la puerta del negocio cerrado: el cartel no cambia. Siempre monta el
 * mismo Provider y la misma caja (con o sin tema): el Stack no se mueve de lugar
 */
export function TemaCatalogo({ children }: TemaCatalogoProps) {
  const { estilo } = useEstiloCatalogo();
  const tema = TEMAS_CATALOGO[estilo] ?? null;
  return (
    <TemaAnidado tema={tema} fondo={NIEVE}>
      <View style={styles.caja}>{children}</View>
    </TemaAnidado>
  );
}

// Uno solo para siempre: el contexto del tema no cambia en cada render
const NIEVE = <NieveNavidad />;

// Sin tokens: solo ocupa todo el lugar
const styles = StyleSheet.create({ caja: { flex: 1 } });
