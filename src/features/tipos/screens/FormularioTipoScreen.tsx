import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert, Button, CampoTexto, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { useFormularioTipo } from '../hooks/useFormularioTipo';
import { NOMBRE_TIPO_MAX } from '../schemas';
import { textoRenombre } from '../textos';

// Formulario: no lleva el gesto de refrescar. El título lo pone el header del Stack
function FormularioTipo({ id }: { id?: string }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const formulario = useFormularioTipo(id);
  const { form, tipo } = formulario;

  if (id && !tipo) {
    return (
      <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
        {formulario.cargando ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        ) : formulario.noExiste ? (
          <View style={styles.bloque}>
            <Text variant="subtitle">Este tipo ya no existe</Text>
            <Button variant="secondary" icon={ArrowLeft} label="Volver a tipos" onPress={formulario.volver} />
          </View>
        ) : (
          <View style={styles.bloque}>
            <Alert tone="danger" message={formulario.errorCarga ?? 'No se pudo cargar el tipo'} />
            <Button variant="secondary" label="Reintentar" onPress={formulario.reintentar} />
          </View>
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          {tipo ? textoRenombre(tipo) : 'Por ejemplo: Tortas, Tartas, Alfajores. Después se lo elegís a cada producto.'}
        </Text>
        <CampoTexto
          control={form.control}
          name="nombre"
          label="Nombre"
          placeholder="Tortas"
          autoCapitalize="sentences"
          maxLength={NOMBRE_TIPO_MAX}
          returnKeyType="done"
          onSubmitEditing={() => void formulario.guardar()}
        />
        {formulario.error && <Alert tone="danger" message={formulario.error} />}
        <Button
          label={tipo ? 'Guardar cambios' : 'Guardar tipo'}
          onPress={() => void formulario.guardar()}
          loading={formulario.guardando}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

/** Más → Tipos → Nuevo tipo */
export function NuevoTipoScreen() {
  return <FormularioTipo />;
}

/** Desde la lista: cambiarle el nombre */
export function RenombrarTipoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FormularioTipo id={id} />;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
