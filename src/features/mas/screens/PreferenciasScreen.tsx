import { StyleSheet, View } from 'react-native';
import { ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { PreferenciaBarra } from '../components/PreferenciaBarra';
import { PreferenciaEncabezado } from '../components/PreferenciaEncabezado';
import { PreferenciaTema } from '../components/PreferenciaTema';
import { PreferenciaTipografia } from '../components/PreferenciaTipografia';

// Se abre desde Más. Cada cambio se ve en el momento y se guarda solo: no hay botón de guardar.
// Sin datos de la API: no lleva useRefrescar. El título lo pone el header del Stack
export function PreferenciasScreen() {
  const styles = useStyles(createStyles);

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        {/* Dos grupos: cómo se ve la app y cómo se recorre */}
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
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    seccion: { gap: theme.spacing.lg },
  });
