import { useEffect, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Cargando, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useEstadoNegocio } from '../hooks/useEstadoNegocio';
import { NegocioCerradoScreen } from '../screens/NegocioCerradoScreen';

interface NegocioAbiertoProps {
  /** Las pantallas públicas (el Stack de la web) */
  children: ReactNode;
}

/**
 * La puerta de la web: con el negocio abierto deja pasar a las pantallas públicas; cerrado, muestra el cartel en
 * cualquier link. Espera a saberlo para no mostrar el catálogo y saltar al cartel. Si el back no responde, también el
 * cartel, con el mensaje por defecto (lo pidió el dueño: mejor «cerrado» que un error de conexión)
 */
export function NegocioAbierto({ children }: NegocioAbiertoProps) {
  const styles = useStyles(createStyles);
  const negocio = useEstadoNegocio();

  // En desarrollo, que se sepa por qué se ve el cartel: suele ser el back apagado o CORS_ORIGINS sin la web
  useEffect(() => {
    if (__DEV__ && negocio.sinRespuesta) {
      console.warn(`La web muestra el cartel de cerrado porque el back no respondió: ${negocio.error ?? 'sin detalle'}`);
    }
  }, [negocio.sinRespuesta, negocio.error]);

  if (negocio.cargando) {
    return (
      <ScreenContainer llenarAlto>
        <Cargando mensaje="Cargando…" llenarAlto style={styles.cargando} />
      </ScreenContainer>
    );
  }
  if (negocio.cerrado || negocio.sinRespuesta) return <NegocioCerradoScreen mensaje={negocio.mensaje} />;
  return children;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.xxl },
  });
