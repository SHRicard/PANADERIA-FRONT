import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { ScreenContainer, type ScreenContainerProps } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { AccionEncabezado } from '../encabezado';
import { ESTILOS_ENCABEZADO } from '../estilosEncabezado';
import { useEstiloEncabezado } from '../hooks/useEstiloEncabezado';
import { PESTANAS_ADMIN, type RutaPestana } from '../pestanas';

interface PantallaPestanaProps extends Pick<ScreenContainerProps, 'refreshControl' | 'alLlegarAlFinal' | 'llenarAlto'> {
  /** Qué pestaña es: el título, el subtítulo y el ícono salen de PESTANAS_ADMIN */
  pestana: RutaPestana;
  /** La acción principal del apartado, si tiene (ej.: «Nuevo» en Productos) */
  accion?: AccionEncabezado;
  children: ReactNode;
}

/**
 * Una pestaña del admin: el encabezado con el estilo que eligió el dueño, arriba del contenido.
 * Al bajar, el encabezado se va con el scroll y queda arriba una barra chica con el título y la acción
 */
export function PantallaPestana({
  pestana,
  accion,
  refreshControl,
  alLlegarAlFinal,
  llenarAlto = false,
  children,
}: PantallaPestanaProps) {
  const styles = useStyles(createStyles);
  const { estilo } = useEstiloEncabezado();
  const { Encabezado, BarraChica } = ESTILOS_ENCABEZADO[estilo];
  const { titulo, subtitulo, icono } = PESTANAS_ADMIN.find(({ ruta }) => ruta === pestana) ?? PESTANAS_ADMIN[0];
  const datos = { titulo, subtitulo, icono, accion };
  // Dónde termina el encabezado grande: pasado ese punto aparece la barra chica
  const [finEncabezado, setFinEncabezado] = useState<number | null>(null);
  const [conBarraChica, setConBarraChica] = useState(false);

  const medir = ({ nativeEvent: { layout } }: LayoutChangeEvent) => setFinEncabezado(layout.y + layout.height);

  return (
    <ScreenContainer
      refreshControl={refreshControl}
      alLlegarAlFinal={alLlegarAlFinal}
      llenarAlto={llenarAlto}
      alDesplazar={(y) => setConBarraChica(finEncabezado !== null && y > finEncabezado)}
      superpuesto={conBarraChica && <BarraChica {...datos} />}
    >
      <View style={[styles.contenido, llenarAlto && styles.llenar]}>
        <View onLayout={medir}>
          <Encabezado {...datos} />
        </View>
        {children}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    llenar: { flexGrow: 1 },
  });
