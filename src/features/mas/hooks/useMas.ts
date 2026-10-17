import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCerrarSesion, useUsuarioSesion } from '@/features/auth';

/** El menú de Más: con quién está abierta la sesión y a dónde lleva cada fila */
export function useMas() {
  const router = useRouter();
  const cerrarSesion = useCerrarSesion();
  const usuario = useUsuarioSesion();

  return {
    usuario,
    abrirBilletera: () => router.push('/billetera'),
    abrirPreferencias: () => router.push('/preferencias'),
    abrirDiseno: () => router.push('/diseno'),
    // Se confirma: está a un toque en un menú por el que se pasa seguido, y salir obliga a escribir la contraseña de nuevo
    cerrarSesion: () =>
      Alert.alert('Cerrar sesión', 'Vas a tener que volver a entrar con tu usuario y contraseña.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesion },
      ]),
  };
}
