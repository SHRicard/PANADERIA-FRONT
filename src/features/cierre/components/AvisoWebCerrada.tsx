import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DoorClosed } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useEstadoNegocio } from '../hooks/useEstadoNegocio';

/**
 * En el inicio del dueño, mientras la web está cerrada: que no se olvide de abrirla. Con la web abierta no muestra
 * nada. Lee la misma consulta que la web (los ajustes): la pantalla que lo usa la refresca con `useEstadoNegocio`
 */
export function AvisoWebCerrada() {
  const styles = useStyles(createStyles);
  const router = useRouter();
  const negocio = useEstadoNegocio();

  if (!negocio.cerrado) return null;

  return (
    <View style={styles.aviso}>
      <View style={styles.fila}>
        <Icon icon={DoorClosed} size="lg" color="warning" />
        <View style={styles.textos}>
          <Text variant="bodyStrong">Tu web está cerrada</Text>
          <Text variant="caption" color="textMuted">
            Los clientes ven el cartel y no pueden hacer pedidos.
          </Text>
        </View>
      </View>
      {/* Se abre eligiendo Vidriera o Carta en Preferencias → Web, donde también se cambia el mensaje */}
      <Button variant="secondary" size="sm" label="Abrirla en Preferencias" onPress={() => router.push('/preferencias')} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    aviso: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.warning,
      backgroundColor: theme.colors.warningSoft,
      alignItems: 'flex-start',
    },
    fila: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
