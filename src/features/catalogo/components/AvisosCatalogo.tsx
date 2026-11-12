import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Croissant, Search } from 'lucide-react-native';
import { Adorno, Alert, Button, Cargando, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

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
  /**
   * El catálogo vacío de un estilo de temporada: su adorno (hecho con estilos) en lugar de la medialuna y sus textos.
   * Sin filtros puestos; «no encontramos» queda igual en todos los estilos
   */
  vacioDeTemporada?: { adorno: ReactNode; titulo: string; texto: string };
}

/** Cargando, el error o «no encontramos» de la lista. Si hay productos para mostrar, no muestra nada */
export function EstadoCatalogo({
  cargando,
  refrescando,
  error,
  reintentar,
  vacio,
  buscando,
  hayFiltros,
  limpiar,
  vacioDeTemporada,
}: EstadoCatalogoProps) {
  const styles = useStyles(createStyles);

  if (cargando && !refrescando) return <Cargando mensaje="Cargando el catálogo…" llenarAlto style={styles.cargando} />;
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
        {buscando ? `No encontramos «${buscando}»` : 'No hay productos con esos filtros'}
      </Text>
      <Text color="textMuted" align="center">
        Probá con otra palabra o mirá todo el catálogo.
      </Text>
      <Button variant="secondary" label="Ver todo el catálogo" onPress={limpiar} />
    </View>
  ) : (
    <View style={styles.vacio}>
      {vacioDeTemporada?.adorno ?? <Icon icon={Croissant} size="xl" color="textMuted" />}
      <Text variant="subtitle" align="center">
        {vacioDeTemporada?.titulo ?? 'Estamos preparando el catálogo'}
      </Text>
      <Text color="textMuted" align="center">
        {vacioDeTemporada?.texto ?? 'Muy pronto vas a ver acá todo lo que horneamos.'}
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
  const styles = useStyles(createStyles);

  if (cargandoMas) return <Cargando tamano="chico" mensaje="Cargando más productos…" style={styles.mas} />;
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

interface PieCatalogoProps {
  /** Lo que va arriba de la marca en un estilo de temporada (un adorno, un saludo). Por defecto, la línea dorada */
  adorno?: ReactNode;
}

/** El cierre de la página, con la marca */
export function PieCatalogo({ adorno }: PieCatalogoProps) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.pie}>
      {adorno ?? <Adorno forma="corto" />}
      <Text variant="caption" color="textMuted" align="center">
        Dama Blanca · Horneados
      </Text>
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
