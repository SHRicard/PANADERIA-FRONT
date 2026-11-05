import { StyleSheet, View } from 'react-native';
import { useRefrescar } from '@/shared/hooks';
import { ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { PreferenciaBarra } from '../components/PreferenciaBarra';
import { PreferenciaCatalogo } from '../components/PreferenciaCatalogo';
import { PreferenciaEncabezado } from '../components/PreferenciaEncabezado';
import { PreferenciaTema } from '../components/PreferenciaTema';
import { PreferenciaTipografia } from '../components/PreferenciaTipografia';
import { usePreferenciaWeb } from '../hooks/usePreferenciaWeb';

// Se abre desde Más. Cada cambio se ve en el momento y se guarda solo: no hay botón de guardar (salvo el mensaje del
// cartel de cerrado, que se escribe). Lo de la app se guarda en el celular; lo de la web (catálogo o cerrado), en el
// back (por eso se refresca tirando para abajo). El título lo pone el header del Stack
export function PreferenciasScreen() {
  const styles = useStyles(createStyles);
  const catalogo = usePreferenciaWeb();
  const refresco = useRefrescar(catalogo.refrescar);

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        {/* Tres grupos: cómo se ve la app, cómo se recorre y cómo la ven los clientes en la web */}
        <View style={styles.seccion}>
          <Text variant="subtitle">Apariencia</Text>
          <PreferenciaTema />
          <PreferenciaTipografia />
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Navegación</Text>
          <PreferenciaBarra />
          <PreferenciaEncabezado />
        </View>

        <View style={styles.seccion}>
          <Text variant="subtitle">Web</Text>
          <PreferenciaCatalogo
            opcion={catalogo.opcion}
            cargando={catalogo.cargando && !refresco.refrescando}
            error={catalogo.error}
            reintentar={catalogo.reintentar}
            errorAlCambiar={catalogo.errorAlCambiar}
            elegir={catalogo.elegir}
            mensaje={catalogo.mensaje}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    seccion: { gap: theme.spacing.lg },
  });
