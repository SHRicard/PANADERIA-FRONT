import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { CamposInsumo } from '../components/CamposInsumo';
import { fechaLarga } from '../fechas';
import { textoCantidad } from '../textos';
import { useFormularioInsumo } from '../hooks/useFormularioInsumo';
import type { ModoFormularioInsumo } from '../types';

const BOTON: Record<ModoFormularioInsumo, string> = {
  nuevo: 'Guardar insumo',
  compra: 'Guardar compra',
  corregir: 'Guardar cambios',
};

function FormularioInsumo({ modo, id }: { modo: ModoFormularioInsumo; id?: string }) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const formulario = useFormularioInsumo(modo, id);
  const { form, insumo } = formulario;

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        {formulario.cargando ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        ) : formulario.errorCarga ? (
          <Alert tone="danger" message={formulario.errorCarga} />
        ) : (
          <>
            {modo === 'nuevo' && (
              <Text color="textMuted">Cargá lo que compraste. Las próximas compras de lo mismo se cargan sobre este insumo.</Text>
            )}
            {modo === 'compra' && insumo && (
              <Text color="textMuted">
                {insumo.nombre}: la última vez pagaste {formatearPrecio(insumo.precio)}
                {insumo.cantidad && insumo.unidad ? ` por ${textoCantidad(insumo.cantidad, insumo.unidad)}` : ''}, el{' '}
                {fechaLarga(insumo.fecha)}.
              </Text>
            )}
            {modo === 'corregir' && (
              <Text color="textMuted">Para arreglar un dato mal cargado. El cambio queda en el historial.</Text>
            )}
            {/* Los cargados antes no dicen cuánto vino: es el momento de completarlo y de sacar el tamaño del nombre */}
            {modo === 'corregir' && insumo && insumo.cantidad === undefined && (
              <Alert
                tone="info"
                message="Este insumo todavía no dice cuánto vino. Completalo abajo y, si el tamaño está en el nombre («HARINA 20 KG»), dejá solo «Harina»."
              />
            )}
            <CamposInsumo
              control={form.control}
              enfocar={form.setFocus}
              pideNombre={formulario.pideNombre}
              alTerminar={() => void formulario.guardar()}
            />
            {formulario.error && <Alert tone="danger" message={formulario.error} />}
            <Button label={BOTON[modo]} onPress={() => void formulario.guardar()} loading={formulario.guardando} fullWidth />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

/** Más → Insumos → Nuevo insumo */
export function NuevoInsumoScreen() {
  return <FormularioInsumo modo="nuevo" />;
}

/** Desde el detalle: una compra nueva (?modo=compra) o una corrección (?modo=corregir) */
export function ActualizarInsumoScreen() {
  const { id, modo } = useLocalSearchParams<{ id: string; modo?: string }>();
  return <FormularioInsumo modo={modo === 'corregir' ? 'corregir' : 'compra'} id={id} />;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.xxl },
  });
