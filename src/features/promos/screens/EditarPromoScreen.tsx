import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { CamposPromo } from '../components/CamposPromo';
import { VistaPromo } from '../components/VistaPromo';
import { useFormularioPromo } from '../hooks/useFormularioPromo';
import { textoPublicaciones } from '../textos';

// Desde la biblioteca: el título y el texto, y borrarla. Formulario: no lleva el gesto de refrescar
export function EditarPromoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const formulario = useFormularioPromo(id);
  const { form, promo } = formulario;

  if (!promo) {
    return (
      <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
        {formulario.cargando ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        ) : formulario.noExiste ? (
          <View style={styles.bloque}>
            <Text variant="subtitle">Esta promo ya no existe</Text>
            <Button variant="secondary" icon={ArrowLeft} label="Volver a promos" onPress={formulario.volver} />
          </View>
        ) : (
          <View style={styles.bloque}>
            <Alert tone="danger" message={formulario.errorCarga ?? 'No se pudo cargar la promo'} />
            <Button variant="secondary" label="Reintentar" onPress={formulario.reintentar} />
          </View>
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <View style={styles.archivo}>
          <VistaPromo tipo={promo.tipo} uri={promo.miniatura} duracionSegundos={promo.duracionSegundos} />
          <Text variant="caption" color="textMuted">
            {textoPublicaciones(promo)}. {promo.tipo === 'video' ? 'El video' : 'La foto'} no se cambia: para usar otro
            archivo, armá una promo nueva.
          </Text>
        </View>

        <CamposPromo control={form.control} enfocar={form.setFocus} />

        {formulario.error && <Alert tone="danger" message={formulario.error} />}
        <View style={styles.acciones}>
          <Button label="Guardar cambios" onPress={() => void formulario.guardar()} loading={formulario.guardando} fullWidth />
          <Button
            variant="danger"
            icon={Trash2}
            label="Borrar promo"
            onPress={formulario.borrar}
            loading={formulario.borrando}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    archivo: { gap: theme.spacing.sm },
    acciones: { gap: theme.spacing.sm },
  });
