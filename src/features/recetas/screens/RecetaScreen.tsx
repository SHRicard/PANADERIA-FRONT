import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChefHat, Pencil, Plus, Tag, Trash2 } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { IngredienteConCosto } from '../components/IngredienteConCosto';
import { useReceta } from '../hooks/useReceta';
import { textoCantidadReceta, textoCosto, textoGanancia } from '../textos';

/** La receta de un producto: lo que cuesta hacer cada unidad, cuántas salen y cada ingrediente con su costo */
export function RecetaScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useReceta(id);
  const refresco = useRefrescar(detalle.refrescar);
  const { receta } = detalle;

  if (!receta) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
        <View style={styles.contenido}>
          {detalle.cargando && !refresco.refrescando ? (
            <Cargando mensaje="Cargando la receta…" llenarAlto style={styles.cargando} />
          ) : detalle.sinReceta ? (
            <View style={styles.bloque}>
              <Text variant="subtitle">Todavía no tiene receta</Text>
              <Text color="textMuted">
                Cargá con qué insumos se hace y cuántas unidades salen, y la app te dice cuánto te cuesta cada una.
              </Text>
              <Button icon={Plus} label="Agregar receta" onPress={detalle.editar} fullWidth />
            </View>
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={detalle.error ?? 'No se pudo cargar la receta'} />
              <Button variant="secondary" label="Reintentar" onPress={detalle.reintentar} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
      <View style={styles.contenido}>
        <View style={styles.bloque}>
          <Text variant="title">{nombreParaMostrar(receta.producto.nombre)}</Text>
          {receta.costoPorUnidad !== null && (
            <Text variant="subtitle" color="primary" style={styles.cifra}>
              {textoCosto(receta.costoPorUnidad)} cada unidad
            </Text>
          )}
          <Text color="textMuted">
            Rinde {textoCantidadReceta(receta.rinde, 'unidad')}
            {receta.costoTotal !== null ? ` · Toda la receta: ${textoCosto(receta.costoTotal)}` : ''}
          </Text>
          <Text color="textMuted">
            Lo vendés a {formatearPrecio(receta.producto.precio)}
            {receta.costoPorUnidad !== null ? ` · ${textoGanancia(receta.producto.precio, receta.costoPorUnidad)}` : ''}
          </Text>
        </View>

        {receta.costoTotal === null && (
          <Alert tone="warning" message="No se pudo calcular lo que cuesta algún ingrediente: revisá sus insumos." />
        )}

        <View style={styles.seccion}>
          <Text variant="subtitle">Ingredientes</Text>
          <Text variant="caption" color="textMuted">
            Con el último precio de cada insumo: si cargás una compra más cara, el costo cambia solo.
          </Text>
          <View>
            {receta.ingredientes.map((ingrediente) => (
              <IngredienteConCosto key={ingrediente.insumo ?? ingrediente.nombre} ingrediente={ingrediente} />
            ))}
          </View>
        </View>

        {detalle.errorBorrar && <Alert tone="danger" message={detalle.errorBorrar} />}

        <View style={styles.acciones}>
          <Button icon={ChefHat} label="Realizar receta" onPress={detalle.realizar} fullWidth />
          <Button variant="secondary" icon={Pencil} label="Editar receta" onPress={detalle.editar} fullWidth />
          {/* Sin costo no hay de dónde sacar el precio: el aviso de arriba dice qué revisar */}
          <Button
            variant="secondary"
            icon={Tag}
            label="Actualizar precio"
            onPress={detalle.actualizarPrecio}
            disabled={receta.costoPorUnidad === null}
            fullWidth
          />
          <Button
            variant="danger"
            icon={Trash2}
            label="Borrar receta"
            onPress={detalle.borrar}
            loading={detalle.borrando}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    cifra: { fontVariant: ['tabular-nums'] },
    seccion: { gap: theme.spacing.xs },
    acciones: { gap: theme.spacing.sm },
  });
