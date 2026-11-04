import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useWatch } from 'react-hook-form';
import { Tag } from 'lucide-react-native';
import {
  Alert,
  Button,
  CampoTexto,
  Cargando,
  ScreenContainer,
  Segmentado,
  Text,
  type OpcionSegmentado,
} from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { ConfirmarPrecio } from '../components/ConfirmarPrecio';
import { usePrecioReceta } from '../hooks/usePrecioReceta';
import { MULTIPLICADOR_MAX } from '../precio';
import { MULTIPLICADORES_RAPIDOS, OTRO_MULTIPLICADOR } from '../schemas';
import { textoCosto, textoGanancia, textoMultiplicador } from '../textos';
import type { EleccionMultiplicador } from '../types';

const OPCIONES: OpcionSegmentado<EleccionMultiplicador>[] = [
  ...MULTIPLICADORES_RAPIDOS.map((valor) => ({ valor, label: textoMultiplicador(Number(valor)) })),
  { valor: OTRO_MULTIPLICADOR, label: 'Otro' },
];

/**
 * Ponerle al producto el precio que sale de la receta: lo que cuesta en ingredientes cada unidad × lo que elija el
 * dueño (×2, ×3, ×4 u otro) y, si quiere, redondeado para arriba ($ 11.691 → $ 12.000). Se confirma en una hoja
 * con el de hoy contra el nuevo. Es un formulario: sin useRefrescar
 */
export function PrecioRecetaScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const precio = usePrecioReceta(id);
  const { form, receta, costo } = precio;
  const eleccion = useWatch({ control: form.control, name: 'eleccion' });

  if (!receta) {
    return (
      <ScreenContainer width="form" edges={['bottom', 'left', 'right']} llenarAlto>
        <View style={styles.contenido}>
          {precio.cargando ? (
            <Cargando mensaje="Cargando la receta…" llenarAlto style={styles.cargando} />
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={precio.errorCarga ?? 'Este producto todavía no tiene receta'} />
              {precio.errorCarga && <Button variant="secondary" label="Reintentar" onPress={precio.reintentar} />}
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']} llenarAlto>
      <View style={styles.contenido}>
        <View style={styles.bloque}>
          <Text variant="title">{nombreParaMostrar(receta.producto.nombre)}</Text>
          {costo !== null && (
            <Text variant="subtitle" color="primary" style={styles.cifra}>
              En ingredientes, cada unidad te sale {textoCosto(costo)}
            </Text>
          )}
          <Text color="textMuted">Hoy lo vendés a {formatearPrecio(receta.producto.precio)}</Text>
        </View>

        {costo === null ? (
          <Alert tone="warning" message="No se pudo calcular lo que cuesta algún ingrediente: revisá sus insumos en la receta." />
        ) : (
          <>
            <View style={styles.seccion}>
              <Text variant="subtitle">¿Por cuánto lo multiplicás?</Text>
              <Text variant="caption" color="textMuted">
                Lo que te cuesta, multiplicado: lo que sobra es tu ganancia.
              </Text>
              <Controller
                control={form.control}
                name="eleccion"
                render={({ field }) => (
                  <Segmentado
                    opciones={OPCIONES}
                    valor={field.value}
                    alCambiar={field.onChange}
                    accessibilityLabel="Por cuánto multiplicás lo que te cuesta"
                  />
                )}
              />
              {eleccion === OTRO_MULTIPLICADOR && (
                <CampoTexto
                  control={form.control}
                  name="otro"
                  label="¿Por cuánto?"
                  placeholder="2,5"
                  helper={`Más que 1 y hasta ${MULTIPLICADOR_MAX}. Con un decimal, si querés.`}
                  keyboardType="decimal-pad"
                />
              )}
            </View>

            {precio.opcionesRedondeo.length > 0 && (
              <View style={styles.seccion}>
                <Text variant="subtitle">¿Lo redondeás?</Text>
                <Text variant="caption" color="textMuted">
                  Siempre para arriba: nunca ganás menos de lo que elegiste.
                </Text>
                <Controller
                  control={form.control}
                  name="redondeo"
                  render={({ field }) => (
                    <Segmentado
                      opciones={precio.opcionesRedondeo.map((opcion) => ({
                        valor: opcion.valor,
                        label: opcion.valor === 'no' ? 'No' : formatearPrecio(opcion.precio),
                      }))}
                      valor={precio.eleccionRedondeo}
                      alCambiar={field.onChange}
                      accessibilityLabel="Redondear el precio"
                    />
                  )}
                />
              </View>
            )}

            {precio.precio !== null && precio.exacto !== null && precio.multiplicador !== null && (
              <View style={styles.seccion}>
                <Text variant="label" color="textMuted">
                  Precio de venta
                </Text>
                <Text variant="title" color="primary" style={styles.cifra}>
                  {formatearPrecio(precio.precio)}
                </Text>
                <Text variant="caption" color="textMuted" style={styles.cifra}>
                  {textoCosto(costo)} {textoMultiplicador(precio.multiplicador)} = {formatearPrecio(precio.exacto)}
                  {precio.redondeo !== null ? ', redondeado para arriba' : ''}
                </Text>
                <Text color="textMuted">
                  {precio.igual ? 'Ya lo vendés a ese precio' : textoGanancia(precio.precio, costo)}
                </Text>
              </View>
            )}

            {precio.daCero && (
              <Alert tone="warning" message="Con lo que cuesta, el precio da $ 0: ponelo a mano desde Editar producto." />
            )}
            {precio.error && !precio.confirmando && <Alert tone="danger" message={precio.error} />}
            <Button
              icon={Tag}
              label="Actualizar precio"
              onPress={() => void precio.actualizar()}
              loading={precio.guardando}
              disabled={!precio.puedeActualizar}
              fullWidth
            />
          </>
        )}
      </View>
      <ConfirmarPrecio
        visible={precio.confirmando}
        confirmacion={precio.confirmacion}
        guardando={precio.guardando}
        error={precio.error}
        alConfirmar={precio.confirmar}
        alCancelar={precio.cancelar}
      />
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    seccion: { gap: theme.spacing.sm },
    cifra: { fontVariant: ['tabular-nums'] },
  });
