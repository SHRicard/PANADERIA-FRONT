import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Croissant, Palette, Search } from 'lucide-react-native';
import { Adorno, Alert, Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

interface EstadoCatalogoProps {
  cargando: boolean;
  /** Mientras dura el gesto de refrescar no va la otra rueda: dos a la vez parece colgado */
  refrescando: boolean;
  error: string | null;
  reintentar: () => void;
  /** Cargó y no hay ningún producto con estos filtros */
  vacio: boolean;
  /** Lo que se buscó, para decirlo en el aviso */
  buscando: string;
  hayFiltros: boolean;
  limpiar: () => void;
}

/** Cargando, el error o «no encontramos» de la lista. Si hay productos para mostrar, no muestra nada */
export function EstadoCatalogo({ cargando, refrescando, error, reintentar, vacio, buscando, hayFiltros, limpiar }: EstadoCatalogoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  if (cargando && !refrescando) return <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />;
  if (error) {
    return (
      <View style={styles.error}>
        <Alert tone="danger" message={error} />
        <Button variant="secondary" label="Reintentar" onPress={reintentar} />
      </View>
    );
  }
  if (!vacio) return null;
  return hayFiltros ? (
    <View style={styles.vacio}>
      <Icon icon={Search} size="xl" color="textMuted" />
      <Text variant="subtitle" align="center">
        {buscando ? `No encontramos «${buscando}»` : 'No hay productos de ese gusto'}
      </Text>
      <Text color="textMuted" align="center">
        Probá con otra palabra o mirá todo el catálogo.
      </Text>
      <Button variant="secondary" label="Ver todo el catálogo" onPress={limpiar} />
    </View>
  ) : (
    <View style={styles.vacio}>
      <Icon icon={Croissant} size="xl" color="textMuted" />
      <Text variant="subtitle" align="center">
        Estamos preparando el catálogo
      </Text>
      <Text color="textMuted" align="center">
        Muy pronto vas a ver acá todo lo que horneamos.
      </Text>
    </View>
  );
}

interface FinDeListaProps {
  cargandoMas: boolean;
  errorMas: string | null;
  hayMas: boolean;
  cargarMas: () => void;
}

/** El final de la lista: la página siguiente cargando, su error, o el botón por si el scroll no alcanza */
export function FinDeLista({ cargandoMas, errorMas, hayMas, cargarMas }: FinDeListaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  if (cargandoMas) return <ActivityIndicator color={theme.colors.primary} style={styles.mas} />;
  if (errorMas) {
    return (
      <View style={styles.error}>
        <Alert tone="danger" message={errorMas} />
        <Button variant="secondary" label="Reintentar" onPress={cargarMas} />
      </View>
    );
  }
  return hayMas ? <Button variant="ghost" label="Ver más productos" onPress={cargarMas} fullWidth /> : null;
}

/** El cierre de la página, con la marca. En desarrollo, la puerta a Diseño del sistema */
export function PieCatalogo() {
  const styles = useStyles(createStyles);
  const router = useRouter();

  return (
    <View style={styles.pie}>
      <Adorno forma="corto" />
      <Text variant="caption" color="textMuted" align="center">
        Dama Blanca · Horneados
      </Text>
      {__DEV__ && <Button variant="ghost" size="sm" icon={Palette} label="Diseño del sistema" onPress={() => router.push('/diseno')} />}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cargando: { paddingVertical: theme.spacing.xxl },
    mas: { paddingVertical: theme.spacing.lg },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
    pie: { alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.xxl },
  });
