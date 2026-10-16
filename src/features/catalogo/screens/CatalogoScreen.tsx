import { ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { useEstiloCatalogo } from '../hooks/useEstiloCatalogo';
import { CatalogoCartaScreen } from './CatalogoCartaScreen';
import { CatalogoVidrieraScreen } from './CatalogoVidrieraScreen';

/**
 * La portada de la web: el catálogo con el estilo que eligió el dueño en Más → Preferencias (se guarda en
 * el back). Espera a saberlo para no mostrar uno y saltar al otro; si el back no responde, va el de por defecto
 */
export function CatalogoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { estilo, cargando } = useEstiloCatalogo();

  if (cargando) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
      </ScreenContainer>
    );
  }
  return estilo === 'vidriera' ? <CatalogoVidrieraScreen /> : <CatalogoCartaScreen />;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.xxl },
  });
