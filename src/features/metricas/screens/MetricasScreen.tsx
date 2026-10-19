import { StyleSheet, View } from 'react-native';
import { ClipboardList, Cookie, Scale, Trophy, Users, Wheat } from 'lucide-react-native';
import { OpcionMenu, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useMetricas } from '../hooks/useMetricas';

// Más → Métricas: la lista de los números del negocio, cada uno con su pantalla. Es un menú, sin datos de la API:
// no lleva useRefrescar. Para sumar una métrica: su ruta en (admin)/metricas, su Stack.Screen y su fila acá
export function MetricasScreen() {
  const styles = useStyles(createStyles);
  const metricas = useMetricas();

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <Text color="textMuted">Los números de tu panadería. Una venta es cada pedido que te hacen, salvo que se cancele.</Text>

        {/* La plata: lo que queda */}
        <View style={styles.grupo}>
          <OpcionMenu
            icono={Scale}
            titulo="Balance"
            descripcion="Lo que entró, lo que salió y lo que te quedó"
            onPress={metricas.abrirBalance}
          />
        </View>

        {/* Las ventas: qué sale */}
        <View style={styles.grupo}>
          <OpcionMenu
            icono={Trophy}
            titulo="Más vendidos"
            descripcion="Los productos que más salen, por unidades o por plata"
            onPress={metricas.abrirProductos}
          />
          <OpcionMenu icono={Cookie} titulo="Gustos" descripcion="Qué gustos se venden más" onPress={metricas.abrirGustos} />
        </View>

        {/* Los pedidos y quién los hace */}
        <View style={styles.grupo}>
          <OpcionMenu
            icono={ClipboardList}
            titulo="Pedidos"
            descripcion="Cuántos, en qué estado, de dónde llegan y qué días"
            onPress={metricas.abrirPedidos}
          />
          <OpcionMenu
            icono={Users}
            titulo="Clientes"
            descripcion="Los nuevos y los que vuelven a comprarte"
            onPress={metricas.abrirClientes}
          />
        </View>

        {/* Los gastos */}
        <View style={styles.grupo}>
          <OpcionMenu
            icono={Wheat}
            titulo="Gasto en insumos"
            descripcion="En qué gastaste más y cuánto aumentó cada uno"
            onPress={metricas.abrirInsumos}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    grupo: { gap: theme.spacing.sm },
  });
