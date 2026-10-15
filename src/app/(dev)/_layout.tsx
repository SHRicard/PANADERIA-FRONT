import { Stack } from 'expo-router';

// El header lo pone el Stack raíz (título "Diseño del sistema")
export default function DevLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
