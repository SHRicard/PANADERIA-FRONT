import { StyleSheet, View } from 'react-native';
import { useRefrescar } from '@/shared/hooks';
import { ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { PreferenciaCatalogo } from '../components/PreferenciaCatalogo';
import { PreferenciaTema } from '../components/PreferenciaTema';
import { usePreferenciaWeb } from '../hooks/usePreferenciaWeb';

// Se abre desde Más. Cada cambio se ve en el momento y se guarda solo: no hay botón de guardar (salvo el mensaje del
// cartel de cerrado, que se escribe). Lo de la app se guarda en el celular; lo de la web (catálogo o cerrado), en el
// back (por eso se refresca tirando para abajo). El título lo pone el header del Stack.
// El estilo de la barra y el del encabezado ya no se eligen acá (2026-11-13: el dueño ya eligió los suyos y era mucho
// ruido): siguen guardados como están y se pueden probar en Diseño del sistema. La tipografía quedó en una sola (clásica)
export function PreferenciasScreen() {
  const styles = useStyles(createStyles);
  const catalogo = usePreferenciaWeb();
  const refresco = useRefrescar(catalogo.refrescar);

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        {/* Dos grupos: cómo se ve la app y cómo la ven los clientes en la web */}
        <View style={styles.seccion}>
          <Text variant="subtitle">Apariencia</Text>
          <PreferenciaTema />
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
