import { StyleSheet, View } from 'react-native';
import { ESTILOS_CATALOGO, type EstiloCatalogo } from '@/features/catalogo';
import { Alert, Button, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { ListaRadio, type OpcionRadio } from './ListaRadio';

const OPCIONES: OpcionRadio<EstiloCatalogo>[] = Object.values(ESTILOS_CATALOGO).map(({ estilo, nombre, descripcion }) => ({
  valor: estilo,
  nombre,
  descripcion,
}));

interface PreferenciaCatalogoProps {
  estilo: EstiloCatalogo;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
  errorAlCambiar: string | null;
  cambiar: (estilo: EstiloCatalogo) => void;
}

// No se guarda en el celular sino en el back: es lo que ven los clientes en la web
export function PreferenciaCatalogo({ estilo, cargando, error, reintentar, errorAlCambiar, cambiar }: PreferenciaCatalogoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.campo}>
      <Text variant="label">Catálogo</Text>
      <Text variant="caption" color="textMuted">
        Cómo ven tus productos los clientes que abren el link de la web.
      </Text>
      {error ? (
        <View style={styles.error}>
          <Alert tone="danger" message={error} />
          <Button variant="secondary" label="Reintentar" onPress={reintentar} />
        </View>
      ) : cargando ? (
        <Text variant="caption" color="textMuted">
          Cargando…
        </Text>
      ) : (
        <ListaRadio opciones={OPCIONES} valor={estilo} alCambiar={cambiar} accessibilityLabel="Catálogo" />
      )}
      {errorAlCambiar && <Alert tone="danger" message={`No se guardó el cambio. ${errorAlCambiar}`} />}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
