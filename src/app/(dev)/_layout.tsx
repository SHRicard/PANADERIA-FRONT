import { Stack } from 'expo-router';
import { EncabezadoPantalla } from '@/features/navegacion';

// Cada pantalla de desarrollo con su título
export default function DevLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, header: (props) => <EncabezadoPantalla {...props} /> }}>
      <Stack.Screen name="diseno" options={{ title: 'Diseño del sistema' }} />
    </Stack>
  );
}
