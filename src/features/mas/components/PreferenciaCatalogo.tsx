import { StyleSheet, View } from 'react-native';
import { ESTILOS_CATALOGO } from '@/features/catalogo';
import { EditorMensajeCierre, type MensajeCierre } from '@/features/cierre';
import { Alert, Button, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { OpcionWeb } from '../hooks/usePreferenciaWeb';
import { ListaRadio, type OpcionRadio } from './ListaRadio';

// Los estilos del catálogo y, al final, la web cerrada
const OPCIONES: OpcionRadio<OpcionWeb>[] = [
  ...Object.values(ESTILOS_CATALOGO).map(({ estilo, nombre, descripcion }) => ({ valor: estilo, nombre, descripcion })),
  {
    valor: 'cerrado',
    nombre: 'Cerrado',
    descripcion: 'Por un tiempo no tomás pedidos: los clientes ven un cartel con tu mensaje en lugar del catálogo',
  },
];

interface PreferenciaCatalogoProps {
  opcion: OpcionWeb;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
  errorAlCambiar: string | null;
  elegir: (opcion: OpcionWeb) => void;
  /** El mensaje del cartel: se escribe acá mismo cuando está elegido «Cerrado» */
  mensaje: MensajeCierre;
}

// No se guarda en el celular sino en el back: es lo que ven los clientes en la web
export function PreferenciaCatalogo({ opcion, cargando, error, reintentar, errorAlCambiar, elegir, mensaje }: PreferenciaCatalogoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.campo}>
      <Text variant="label">Catálogo</Text>
      <Text variant="caption" color="textMuted">
        Cómo ven la web los clientes que abren el link. Si por un tiempo no podés tomar pedidos, elegí «Cerrado».
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
        <>
          <ListaRadio opciones={OPCIONES} valor={opcion} alCambiar={elegir} accessibilityLabel="Catálogo" />
          {opcion === 'cerrado' && <EditorMensajeCierre mensaje={mensaje} />}
        </>
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
