import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useBorrarTipoMutation, useListarTiposQuery } from '../api/tiposApi';
import type { Tipo } from '../types';

/** La lista de tipos (Más → Tipos) */
export function useTipos() {
  const router = useRouter();
  // cantidadProductos cambia cuando se crea o edita un producto: se pide de nuevo cada vez que se abre la pantalla
  const consulta = useListarTiposQuery(undefined, { refetchOnMountOrArgChange: true });
  const [borrarTipo] = useBorrarTipoMutation();

  return {
    tipos: consulta.data ?? [],
    cargando: consulta.isLoading,
    error: consulta.isError && !consulta.data ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    nuevo: () => router.push('/tipos/nuevo'),
    /** Cambiarle el nombre */
    abrir: (tipo: Tipo) => router.push({ pathname: '/tipos/[id]', params: { id: tipo._id } }),
    // Se confirma diciendo qué pasa con los productos: quedan sin tipo, no se borran
    borrar: (tipo: Tipo) =>
      Alert.alert(
        `Borrar «${tipo.nombre}»`,
        tipo.cantidadProductos === 0
          ? 'Ningún producto lo usa.'
          : `${tipo.cantidadProductos === 1 ? 'El producto que lo usa va' : `Los ${tipo.cantidadProductos} productos que lo usan van`} a quedar sin tipo. No se borra ningún producto.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Borrar',
            style: 'destructive',
            onPress: () => {
              borrarTipo(tipo._id)
                .unwrap()
                .catch((e: unknown) => Alert.alert('No se pudo borrar', mensajeDeError(e)));
            },
          },
        ]
      ),
  };
}
