import { Stack } from 'expo-router';
import { useHaySesion } from '@/features/auth';

// Sin sesión solo se llega al login y a la recuperación de contraseña. Al iniciar o cerrar la
// sesión no hace falta navegar: el guard cambia y Expo Router lleva a la pantalla que corresponde.
export default function AdminLayout() {
  const haySesion = useHaySesion();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={haySesion}>
        <Stack.Screen name="panel" />
      </Stack.Protected>

      <Stack.Protected guard={!haySesion}>
        <Stack.Screen name="login" />
        <Stack.Screen name="recuperar" />
        <Stack.Screen name="restablecer" />
      </Stack.Protected>
    </Stack>
  );
}
