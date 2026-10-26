import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Plus, Tags } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TarjetaTipo } from '../components/TarjetaTipo';
import { useTipos } from '../hooks/useTipos';

// Más → Tipos. El título lo pone el header del Stack
export function TiposScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const lista = useTipos();
  const refresco = useRefrescar(lista.refrescar);
  const vacio = !lista.cargando && !lista.error && lista.tipos.length === 0;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Para ordenar tus productos: tortas, tartas, alfajores… A cada producto le elegís uno al cargarlo o editarlo. Es
          aparte del gusto, que sigue siendo dulce, salado…
        </Text>
        <Button icon={Plus} label="Nuevo tipo" onPress={lista.nuevo} fullWidth />

        {lista.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}

        {lista.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={lista.error} />
            <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
          </View>
        )}

        {vacio && (
          <View style={styles.vacio}>
            <Icon icon={Tags} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              Todavía no armaste tipos
            </Text>
            <Text color="textMuted" align="center">
              Tocá «Nuevo tipo» para armar el primero: por ejemplo, Tortas.
            </Text>
          </View>
        )}

        {lista.tipos.map((tipo) => (
          <TarjetaTipo key={tipo._id} tipo={tipo} onAbrir={() => lista.abrir(tipo)} onBorrar={() => lista.borrar(tipo)} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
  });
