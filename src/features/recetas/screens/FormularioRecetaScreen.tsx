import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Alert, Button, CampoTexto, Cargando, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { FilaIngrediente } from '../components/FilaIngrediente';
import { useFormularioReceta } from '../hooks/useFormularioReceta';

/** Cargar o editar la receta de un producto. Es un formulario: sin useRefrescar */
export function FormularioRecetaScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const formulario = useFormularioReceta(id);
  const { form, incompletos } = formulario;

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']} llenarAlto>
      <View style={styles.contenido}>
        {formulario.cargando ? (
          <Cargando mensaje="Cargando la receta…" llenarAlto style={styles.cargando} />
        ) : formulario.errorCarga ? (
          <View style={styles.bloque}>
            <Alert tone="danger" message={formulario.errorCarga} />
            <Button variant="secondary" label="Reintentar" onPress={formulario.reintentar} />
          </View>
        ) : (
          <>
            <Text color="textMuted">
              Con qué insumos se hace y cuántas unidades salen. El costo se calcula con el último precio de cada insumo.
            </Text>
            {incompletos > 0 && (
              <Alert
                tone="info"
                message={`${incompletos === 1 ? 'Un insumo no dice' : `${incompletos} insumos no dicen`} cuánto trae la bolsa y no se ${incompletos === 1 ? 'puede' : 'pueden'} elegir. Completalo en Más → Insumos con «Corregir datos».`}
              />
            )}
            <CampoTexto
              control={form.control}
              name="rinde"
              label="¿Cuántas unidades salen?"
              placeholder="50"
              helper="En unidades, no en docenas: si salen 4 docenas, poné 48."
              keyboardType="number-pad"
            />
            <View>
              <Text variant="subtitle">Ingredientes</Text>
              {formulario.campos.map((campo, indice) => (
                <FilaIngrediente
                  key={campo.id}
                  control={form.control}
                  indice={indice}
                  opciones={formulario.opciones}
                  unidadDeInsumo={formulario.unidadDeInsumo}
                  alQuitar={() => formulario.quitar(indice)}
                  puedeQuitar={formulario.campos.length > 1}
                />
              ))}
            </View>
            {formulario.errorLista && <Alert tone="danger" message={formulario.errorLista} />}
            {formulario.puedeAgregar && (
              <Button variant="secondary" icon={Plus} label="Agregar ingrediente" onPress={formulario.agregar} fullWidth />
            )}
            {formulario.error && <Alert tone="danger" message={formulario.error} />}
            <Button
              label={formulario.esNueva ? 'Guardar receta' : 'Guardar cambios'}
              onPress={() => void formulario.guardar()}
              loading={formulario.guardando}
              fullWidth
            />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
