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
        <Stack.Screen name="preferencias" options={{ headerShown: true, title: 'Preferencias' }} />
      </Stack.Protected>

      <Stack.Protected guard={!haySesion}>
        <Stack.Screen name="login" />
        <Stack.Screen name="recuperar" />
        <Stack.Screen name="restablecer" />
      </Stack.Protected>
    </Stack>
  );
}
