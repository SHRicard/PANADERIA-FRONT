import type { ComponentType } from 'react';
import { StyleSheet } from 'react-native';
import { Cargando, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useEstiloCatalogo } from '../hooks/useEstiloCatalogo';
import type { EstiloCatalogo } from '../types';
import { CatalogoCartaScreen } from './CatalogoCartaScreen';
import { CatalogoDiaNavidadScreen } from './CatalogoDiaNavidadScreen';
import { CatalogoNocheNavidadScreen } from './CatalogoNocheNavidadScreen';
import { CatalogoVidrieraScreen } from './CatalogoVidrieraScreen';

/**
 * La pantalla de cada estilo. Sumar uno (otro de temporada) es una entrada acá, otra en ESTILOS_CATALOGO y, si trae
 * colores propios, otra en TEMAS_CATALOGO (docs/catalogo-navidad.md)
 */
const PANTALLAS: Record<EstiloCatalogo, ComponentType> = {
  vidriera: CatalogoVidrieraScreen,
  carta: CatalogoCartaScreen,
  'dia-navidad': CatalogoDiaNavidadScreen,
  'noche-navidad': CatalogoNocheNavidadScreen,
};

/**
 * La portada de la web: el catálogo con el estilo que eligió el dueño en Más → Preferencias (se guarda en
 * el back). Espera a saberlo para no mostrar uno y saltar al otro; si el back no responde, va el de por defecto
 */
export function CatalogoScreen() {
  const styles = useStyles(createStyles);
  const { estilo, cargando } = useEstiloCatalogo();
  const Pantalla = PANTALLAS[estilo];

  if (cargando) {
    return (
      <ScreenContainer centered>
        <Cargando mensaje="Cargando el catálogo…" style={styles.cargando} />
      </ScreenContainer>
    );
  }
  return <Pantalla />;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.xxl },
  });
