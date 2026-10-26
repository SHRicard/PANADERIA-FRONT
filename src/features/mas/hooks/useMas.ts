import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCerrarSesion, useUsuarioSesion } from '@/features/auth';

// La de app.json, la misma con la que ./run.sh apk nombra el archivo (panaderia-digital-1.0.0.apk).
// En desarrollo el número es el mismo que el de la APK: la marca dice cuál está instalada
const version = Constants.expoConfig?.version;
const textoVersion = version ? `Versión ${version}${__DEV__ ? ' · desarrollo' : ''}` : null;

/** El menú de Más: con quién está abierta la sesión y a dónde lleva cada fila */
export function useMas() {
  const router = useRouter();
  const cerrarSesion = useCerrarSesion();
  const usuario = useUsuarioSesion();

  return {
    usuario,
    /** «Versión 1.0.0»: para saber qué APK tiene instalada el dueño */
    version: textoVersion,
    abrirPedidoManual: () => router.push('/pedido-manual'),
    abrirMetricas: () => router.push('/metricas'),
    abrirInsumos: () => router.push('/insumos'),
    abrirTipos: () => router.push('/tipos'),
    abrirPromos: () => router.push('/promos'),
    abrirBilletera: () => router.push('/billetera'),
    abrirMemoria: () => router.push('/memoria'),
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
