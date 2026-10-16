import { StyleSheet, View } from 'react-native';
import { useEstiloCatalogo } from '@/features/catalogo';
import { useRefrescar } from '@/shared/hooks';
import { ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { PreferenciaBarra } from '../components/PreferenciaBarra';
import { PreferenciaCatalogo } from '../components/PreferenciaCatalogo';
import { PreferenciaEncabezado } from '../components/PreferenciaEncabezado';
import { PreferenciaTema } from '../components/PreferenciaTema';
import { PreferenciaTipografia } from '../components/PreferenciaTipografia';

// Se abre desde Más. Cada cambio se ve en el momento y se guarda solo: no hay botón de guardar.
// Lo de la app se guarda en el celular; el catálogo, en el back (por eso se refresca tirando para abajo).
// El título lo pone el header del Stack
export function PreferenciasScreen() {
  const styles = useStyles(createStyles);
  const catalogo = useEstiloCatalogo();
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
            estilo={catalogo.estilo}
            cargando={catalogo.cargando && !refresco.refrescando}
            error={catalogo.error}
            reintentar={catalogo.reintentar}
            errorAlCambiar={catalogo.errorAlCambiar}
            cambiar={(estilo) => void catalogo.cambiar(estilo)}
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
