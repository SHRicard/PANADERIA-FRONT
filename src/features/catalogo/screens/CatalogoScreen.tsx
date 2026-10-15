import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette } from 'lucide-react-native';
import { Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

// Placeholder de la web pública. Cuando traiga /api/catalogo, suma useRefrescar en la misma tarea
export function CatalogoScreen() {
  const styles = useStyles(createStyles);
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.contenido}>
        <Text variant="display">Panadería Digital</Text>
        <Text color="textMuted">Muy pronto vas a ver acá todos nuestros productos.</Text>
        {__DEV__ && (
          <View style={styles.dev}>
            <Button variant="ghost" icon={Palette} label="Diseño del sistema" onPress={() => router.push('/diseno')} />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.sm },
    dev: { alignItems: 'flex-start', marginTop: theme.spacing.lg },
  });
