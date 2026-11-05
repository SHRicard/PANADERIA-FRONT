import { StyleSheet, View } from 'react-native';
import { Save } from 'lucide-react-native';
import { Alert, Button, CampoTexto, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { MensajeCierre } from '../hooks/useCierre';
import { MAX_MENSAJE_CERRADO } from '../textos';
import { CartelPuerta } from './CartelPuerta';

interface EditorMensajeCierreProps {
  mensaje: MensajeCierre;
}

/**
 * Lo que el dueño les dice a los clientes mientras la web está cerrada, con la vista previa del cartel tal cual lo
 * ven. Va debajo de las opciones del catálogo, en Preferencias → Web, cuando está elegido «Cerrado»
 */
export function EditorMensajeCierre({ mensaje }: EditorMensajeCierreProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.editor}>
      <CampoTexto
        control={mensaje.control}
        name="mensaje"
        label="Qué les decís a tus clientes"
        placeholder="Ej.: Me fui de vacaciones, vuelvo el lunes 10. ¡Gracias por esperarme!"
        helper={`Si lo dejás vacío, va uno que dice que cerraste por un motivo de fuerza mayor. Hasta ${MAX_MENSAJE_CERRADO} letras.`}
        multiline
        maxLength={MAX_MENSAJE_CERRADO}
      />
      {mensaje.hayCambios && (
        <Button
          variant="secondary"
          icon={Save}
          label="Guardar el mensaje"
          onPress={mensaje.guardar}
          loading={mensaje.guardando}
          fullWidth
        />
      )}
      {mensaje.guardado && !mensaje.hayCambios && <Alert tone="success" message="Listo: los clientes ya ven el mensaje nuevo." />}
      {mensaje.error && <Alert tone="danger" message={`No se guardó el mensaje. ${mensaje.error}`} />}

      <Text variant="label">Así lo ven tus clientes</Text>
      <View style={styles.vistaPrevia}>
        <CartelPuerta mensaje={mensaje.vistaPrevia} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    editor: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
    // Como se ve en la web: sobre el fondo de la página, recortado en un marco
    vistaPrevia: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
  });
