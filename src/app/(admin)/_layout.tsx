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
      {/* redirectTo: desde el SDK 58, sin él el router manda a la URL del grupo, que no tiene pantalla (404) */}
      <Stack.Protected guard={haySesion} redirectTo="/login">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="productos/nuevo" options={{ headerShown: true, title: 'Nuevo producto' }} />
        <Stack.Screen name="productos/[id]/index" options={{ headerShown: true, title: 'Producto' }} />
        <Stack.Screen name="productos/[id]/editar" options={{ headerShown: true, title: 'Editar producto' }} />
        <Stack.Screen name="productos/[id]/receta/index" options={{ headerShown: true, title: 'Receta' }} />
        <Stack.Screen name="productos/[id]/receta/editar" options={{ headerShown: true, title: 'Cargar receta' }} />
        <Stack.Screen name="productos/[id]/receta/precio" options={{ headerShown: true, title: 'Actualizar precio' }} />
        <Stack.Screen name="productos/[id]/receta/hacer" options={{ headerShown: true, title: 'Realizar receta' }} />
        <Stack.Screen name="pedidos/[id]" options={{ headerShown: true, title: 'Pedido' }} />
        <Stack.Screen name="agenda/[fecha]" options={{ headerShown: true, title: 'Agenda' }} />
        <Stack.Screen name="preferencias" options={{ headerShown: true, title: 'Preferencias' }} />
        <Stack.Screen name="billetera" options={{ headerShown: true, title: 'Billetera' }} />
        <Stack.Screen name="pedido-manual" options={{ headerShown: true, title: 'Pedido manual' }} />
        <Stack.Screen name="editar-pedido/[id]" options={{ headerShown: true, title: 'Editar productos' }} />
        <Stack.Screen name="insumos/index" options={{ headerShown: true, title: 'Insumos' }} />
        <Stack.Screen name="insumos/nuevo" options={{ headerShown: true, title: 'Nuevo insumo' }} />
        <Stack.Screen name="insumos/[id]/index" options={{ headerShown: true, title: 'Insumo' }} />
        <Stack.Screen name="insumos/[id]/actualizar" options={{ headerShown: true, title: 'Actualizar insumo' }} />
        <Stack.Screen name="tipos/index" options={{ headerShown: true, title: 'Tipos' }} />
        <Stack.Screen name="tipos/nuevo" options={{ headerShown: true, title: 'Nuevo tipo' }} />
        <Stack.Screen name="tipos/[id]" options={{ headerShown: true, title: 'Renombrar tipo' }} />
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

      <Stack.Protected guard={!haySesion} redirectTo="/dashboard">
        <Stack.Screen name="login" />
        <Stack.Screen name="recuperar" />
        <Stack.Screen name="restablecer" />
      </Stack.Protected>
    </Stack>
  );
}
