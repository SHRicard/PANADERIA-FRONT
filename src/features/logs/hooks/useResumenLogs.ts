import { useState } from 'react';
import { Alert } from 'react-native';
import { mensajeDeError } from '@/services/api';
import { useBorrarLogsMutation, useCambiarBorradoAutomaticoMutation, useObtenerResumenLogsQuery } from '../api/logsApi';
import { diasDeOpcion, opcionDeDias, type OpcionBorrado } from '../textos';

/** La cabecera de Logs: los números, cada cuánto se borran solos y «Borrar todo» */
export function useResumenLogs() {
  const consulta = useObtenerResumenLogsQuery(undefined, { refetchOnMountOrArgChange: true });
  const resumen = consulta.data;

  const [cambiarDias, cambio] = useCambiarBorradoAutomaticoMutation();
  const [borrarLogs, borrado] = useBorrarLogsMutation();
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const borrarTodo = async () => {
    setErrorAccion(null);
    try {
      await borrarLogs().unwrap();
    } catch (e) {
      setErrorAccion(mensajeDeError(e));
    }
  };

  return {
    resumen,
    cargando: consulta.isLoading,
    error: consulta.isError && !resumen ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },

    borradoAutomatico: resumen ? opcionDeDias(resumen.diasLogs) : null,
    cambiandoBorrado: cambio.isLoading,
    cambiarBorradoAutomatico: async (opcion: OpcionBorrado) => {
      setErrorAccion(null);
      try {
        await cambiarDias(diasDeOpcion(opcion)).unwrap();
      } catch (e) {
        setErrorAccion(mensajeDeError(e));
      }
    },

    borrando: borrado.isLoading,
    // Se confirma: no se puede deshacer
    pedirBorrarTodo: () =>
      Alert.alert('¿Borrar todos los logs?', 'Se borran todas las peticiones guardadas. Los nombres de las IP quedan. No se puede deshacer.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar todo', style: 'destructive', onPress: () => void borrarTodo() },
      ]),
    errorAccion,
  };
}
