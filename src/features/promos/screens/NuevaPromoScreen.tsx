import { StyleSheet, View } from 'react-native';
import { ImagePlus } from 'lucide-react-native';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { CamposPromo } from '../components/CamposPromo';
import { VistaPromo } from '../components/VistaPromo';
import { useFormularioPromo } from '../hooks/useFormularioPromo';
import { MAX_SEGUNDOS_VIDEO } from '../schemas';

// Más → Promos → Nueva promo. Formulario: no lleva el gesto de refrescar
export function NuevaPromoScreen() {
  const styles = useStyles(createStyles);
  const formulario = useFormularioPromo();
  const { form, archivo } = formulario;

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Armala una vez y compartila todas las veces que quieras. Una foto, o un video de hasta {MAX_SEGUNDOS_VIDEO}{' '}
          segundos.
        </Text>

        <View style={styles.archivo}>
          {/* El video no tiene vista previa hasta subirlo: alcanza con el recuadro y cuánto dura */}
          {archivo && (
            <VistaPromo
              tipo={archivo.tipo}
              uri={archivo.tipo === 'imagen' ? archivo.uri : null}
              duracionSegundos={archivo.duracionSegundos}
            />
          )}
          <Button
            variant="secondary"
            icon={ImagePlus}
            label={archivo ? 'Elegir otro' : 'Elegir foto o video'}
            onPress={formulario.elegirArchivo}
            disabled={formulario.subiendo}
            fullWidth
          />
          {formulario.avisoArchivo && <Alert tone="warning" message={formulario.avisoArchivo} />}
        </View>

        <CamposPromo control={form.control} enfocar={form.setFocus} />

        {formulario.error && <Alert tone="danger" message={formulario.error} />}
        <View style={styles.guardar}>
          <Button
            label={formulario.subiendo ? 'Subiendo…' : 'Guardar promo'}
            onPress={() => void formulario.guardar()}
            loading={formulario.subiendo}
            fullWidth
          />
          {formulario.subiendo && archivo?.tipo === 'video' && (
            <Text variant="caption" color="textMuted" align="center">
              Un video tarda un poco más en subir. No cierres la app.
            </Text>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.lg },
    archivo: { gap: theme.spacing.sm },
    guardar: { gap: theme.spacing.xs },
  });
