import { StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Alert, Button, Select } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { OPCIONES_BORRADO, type OpcionBorrado } from '../textos';

interface AjustesLogsProps {
  borradoAutomatico: OpcionBorrado | null;
  alCambiarBorrado: (opcion: OpcionBorrado) => void;
  cambiandoBorrado: boolean;
  onBorrarTodo: () => void;
  borrando: boolean;
  /** No hay nada guardado: «Borrar todo» no tiene qué borrar */
  vacio: boolean;
  error: string | null;
}

/** Cuánto se guarda: cada cuánto se borran solos y el botón para borrar todo ya */
export function AjustesLogs({
  borradoAutomatico,
  alCambiarBorrado,
  cambiandoBorrado,
  onBorrarTodo,
  borrando,
  vacio,
  error,
}: AjustesLogsProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.caja}>
      <Select
        label="Borrar los logs viejos"
        opciones={OPCIONES_BORRADO}
        valor={borradoAutomatico}
        alCambiar={alCambiarBorrado}
        helper="Cambiarlo también vale para lo que ya está guardado."
        disabled={cambiandoBorrado || borradoAutomatico === null}
      />
      <View style={styles.boton}>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          label="Borrar todo"
          onPress={onBorrarTodo}
          loading={borrando}
          disabled={vacio}
          accessibilityLabel="Borrar todos los logs"
        />
      </View>
      {error && <Alert tone="danger" message={error} />}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    caja: { gap: theme.spacing.sm },
    boton: { alignItems: 'flex-start' },
  });
