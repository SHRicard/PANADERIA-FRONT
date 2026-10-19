import { Stack } from 'expo-router';
import { useHaySesion } from '@/features/auth';
import { EncabezadoPantalla } from '@/features/navegacion';

// Sin sesión solo se llega al login y a la recuperación de contraseña. Al iniciar o cerrar la
// sesión no hace falta navegar: el guard cambia y Expo Router lleva a la pantalla que corresponde.
// Las pantallas con header usan el propio de la app (EncabezadoPantalla), no el de fábrica.
export default function AdminLayout() {
  const haySesion = useHaySesion();

  return (
    <Stack screenOptions={{ headerShown: false, header: (props) => <EncabezadoPantalla {...props} /> }}>
      <Stack.Protected guard={haySesion}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="productos/nuevo" options={{ headerShown: true, title: 'Nuevo producto' }} />
        <Stack.Screen name="productos/[id]/index" options={{ headerShown: true, title: 'Producto' }} />
        <Stack.Screen name="productos/[id]/editar" options={{ headerShown: true, title: 'Editar producto' }} />
        <Stack.Screen name="pedidos/[id]" options={{ headerShown: true, title: 'Pedido' }} />
        <Stack.Screen name="preferencias" options={{ headerShown: true, title: 'Preferencias' }} />
        <Stack.Screen name="billetera" options={{ headerShown: true, title: 'Billetera' }} />
        <Stack.Screen name="pedido-manual" options={{ headerShown: true, title: 'Pedido manual' }} />
        <Stack.Screen name="insumos/index" options={{ headerShown: true, title: 'Insumos' }} />
        <Stack.Screen name="insumos/nuevo" options={{ headerShown: true, title: 'Nuevo insumo' }} />
        <Stack.Screen name="insumos/[id]/index" options={{ headerShown: true, title: 'Insumo' }} />
        <Stack.Screen name="insumos/[id]/actualizar" options={{ headerShown: true, title: 'Actualizar insumo' }} />
        <Stack.Screen name="promos/index" options={{ headerShown: true, title: 'Promos' }} />
        <Stack.Screen name="promos/nueva" options={{ headerShown: true, title: 'Nueva promo' }} />
        <Stack.Screen name="promos/[id]" options={{ headerShown: true, title: 'Editar promo' }} />
        <Stack.Screen name="memoria" options={{ headerShown: true, title: 'Memoria' }} />
        <Stack.Screen name="metricas/index" options={{ headerShown: true, title: 'Métricas' }} />
        <Stack.Screen name="metricas/balance" options={{ headerShown: true, title: 'Balance' }} />
        <Stack.Screen name="metricas/productos" options={{ headerShown: true, title: 'Más vendidos' }} />
        <Stack.Screen name="metricas/gustos" options={{ headerShown: true, title: 'Gustos' }} />
        <Stack.Screen name="metricas/pedidos" options={{ headerShown: true, title: 'Pedidos' }} />
        <Stack.Screen name="metricas/clientes" options={{ headerShown: true, title: 'Clientes' }} />
        <Stack.Screen name="metricas/insumos" options={{ headerShown: true, title: 'Gasto en insumos' }} />
      </Stack.Protected>

      <Stack.Protected guard={!haySesion}>
        <Stack.Screen name="login" />
        <Stack.Screen name="recuperar" />
        <Stack.Screen name="restablecer" />
      </Stack.Protected>
    </Stack>
  );
}
