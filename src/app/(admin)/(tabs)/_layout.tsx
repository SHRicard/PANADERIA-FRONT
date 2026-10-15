import { Tabs } from 'expo-router/js-tabs';
import { BarraPestanas, PESTANAS_ADMIN } from '@/features/navegacion';

// Las pestañas (orden, título e ícono) salen de PESTANAS_ADMIN. Cada pantalla pone su propio título.
// La barra cambia de estilo según lo que elija el dueño en Más → Preferencias
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BarraPestanas {...props} />}>
      {PESTANAS_ADMIN.map(({ ruta, titulo }) => (
        <Tabs.Screen key={ruta} name={ruta} options={{ title: titulo }} />
      ))}
    </Tabs>
  );
}
