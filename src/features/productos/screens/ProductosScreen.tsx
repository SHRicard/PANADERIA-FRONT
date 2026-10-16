import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Croissant, Plus, Search } from 'lucide-react-native';
import { PantallaPestana } from '@/features/navegacion';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { FiltrosProductos } from '../components/FiltrosProductos';
import { TarjetaProducto } from '../components/TarjetaProducto';
import { useProductos } from '../hooks/useProductos';

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

export function ProductosScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const productos = useProductos();
  const { filtros } = productos;
  const refresco = useRefrescar(productos.refrescar);
  const vacio = !productos.cargando && !productos.error && productos.productos.length === 0;

  return (
    <PantallaPestana
      pestana="productos"
      accion={{ label: 'Nuevo', icon: Plus, onPress: productos.nuevo, accessibilityLabel: 'Nuevo producto' }}
      refreshControl={refresco.control}
      alLlegarAlFinal={productos.cargarMas}
    >
      <View style={styles.contenido}>
        <View style={styles.filtros}>
          <FiltrosProductos filtros={filtros} total={productos.cargando ? null : productos.total} />
          {!productos.cargando && !productos.error && productos.total > 0 && (
            <Text variant="caption" color="textMuted">
              {cantidad(productos.total)}
            </Text>
          )}
        </View>

        {productos.cargando && !refresco.refrescando && (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        )}

        {productos.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={productos.error} />
            <Button variant="secondary" label="Reintentar" onPress={productos.reintentar} />
          </View>
        )}

        {vacio &&
          (filtros.hayFiltros ? (
            <View style={styles.vacio}>
              <Icon icon={Search} size="xl" color="textMuted" />
              <Text variant="subtitle" align="center">
                Ningún producto coincide
              </Text>
              <Button variant="secondary" label="Quitar filtros" onPress={filtros.limpiar} />
            </View>
          ) : (
            <View style={styles.vacio}>
              <Icon icon={Croissant} size="xl" color="textMuted" />
              <Text variant="subtitle" align="center">
                Todavía no cargaste productos
              </Text>
              <Text color="textMuted" align="center">
                Tocá «Nuevo» para cargar el primero, con sus fotos.
              </Text>
            </View>
          ))}

        {productos.productos.map((producto) => (
          <TarjetaProducto
            key={producto._id}
            producto={producto}
            enCola={productos.colaDe(producto._id)}
            onPress={() => productos.abrir(producto)}
            onReintentar={productos.reintentarFotos}
            onDescartar={productos.descartarFotos}
          />
        ))}

        {/* El final de la lista: cargando la página siguiente, su error, o el botón por si el scroll no alcanza */}
        {productos.cargandoMas ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.mas} />
        ) : productos.errorMas ? (
          <View style={styles.error}>
            <Alert tone="danger" message={productos.errorMas} />
            <Button variant="secondary" label="Reintentar" onPress={productos.cargarMas} />
          </View>
        ) : productos.hayMas ? (
          <Button variant="ghost" label="Ver más productos" onPress={productos.cargarMas} fullWidth />
        ) : null}
      </View>
    </PantallaPestana>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.md },
    filtros: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
    cargando: { paddingVertical: theme.spacing.xxl },
    mas: { paddingVertical: theme.spacing.lg },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
  });
