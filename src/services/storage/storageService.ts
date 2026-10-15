import { Platform } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';

// Cifra el archivo del token en el celular. La clave viaja dentro del APK: protege contra leer
// el archivo en texto plano, no contra alguien que descompile la app.
const CLAVE_CIFRADO = 'pd-sesion-k7Qm2x';

// La web se prerenderiza en Node, donde no hay localStorage: ahí no se lee ni se guarda nada
const hayStorage = Platform.OS !== 'web' || typeof window !== 'undefined';

export interface Almacen {
  leer: (clave: string) => string | null;
  guardar: (clave: string, valor: string) => void;
  borrar: (clave: string) => void;
}

// La instancia se crea recién al primer uso: así importar este archivo nunca toca el storage
function crearAlmacen(crear: () => MMKV): Almacen {
  let instancia: MMKV | undefined;
  const mmkv = () => (instancia ??= crear());

  const leer = (clave: string) => (hayStorage ? (mmkv().getString(clave) ?? null) : null);
  const guardar = (clave: string, valor: string) => {
    if (hayStorage) mmkv().set(clave, valor);
  };
  const borrar = (clave: string) => {
    if (hayStorage) mmkv().remove(clave);
  };

  return { leer, guardar, borrar };
}

export const storageService = {
  /** Preferencias de la app (tema, etc.) */
  general: crearAlmacen(() => createMMKV({ id: 'panaderia-general' })),
  /** Sesión del admin. En la web MMKV no soporta cifrado, pero el admin nunca corre ahí */
  seguro: crearAlmacen(() =>
    createMMKV(
      Platform.OS === 'web'
        ? { id: 'panaderia-seguro' }
        : { id: 'panaderia-seguro', encryptionKey: CLAVE_CIFRADO }
    )
  ),
};
