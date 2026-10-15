import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Palette } from 'lucide-react-native';
import { useCerrarSesion } from '@/features/auth';
import { Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

// Inicio del admin. Por ahora no trae datos: cuando muestre productos o pedidos, suma useRefrescar
export function PanelScreen() {
  const styles = useStyles(createStyles);
  const router = useRouter();
  const cerrarSesion = useCerrarSesion();

  return (
    <ScreenContainer>
      <View style={styles.contenido}>
        <View style={styles.encabezado}>
          <Text variant="heading">Panel</Text>
          <Text color="textMuted">Muy pronto vas a poder cargar productos y promos, y ver los pedidos desde acá.</Text>
        </View>

        <View style={styles.acciones}>
          {__DEV__ && (
            <Button
              variant="secondary"
              icon={Palette}
              label="Diseño del sistema"
              onPress={() => router.push('/diseno')}
            />
          )}
          <Button variant="ghost" icon={LogOut} label="Cerrar sesión" onPress={cerrarSesion} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    encabezado: { gap: theme.spacing.sm },
    acciones: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
