import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCambiarAjustesMutation, useObtenerAjustesQuery, type CambiosAjustes } from '@/features/ajustes';
import { mensajeDeError } from '@/services/api';
import { formularioCierreSchema } from '../schemas';
import { mensajeParaMostrar } from '../textos';
import type { FormularioCierre } from '../types';

const VACIO: FormularioCierre = { mensaje: '' };

/**
 * Cerrar la web por un tiempo (vacaciones, fuerza mayor) y lo que dice el cartel. Lo usa Más → Preferencias → Web,
 * donde «Cerrado» es una opción más del catálogo, al lado de Vidriera y Carta. Se guarda en el back
 * (PATCH /api/ajustes), porque lo tiene que ver la web
 */
export function useCierre() {
  const consulta = useObtenerAjustesQuery();
  const [cambiarAjustes, { isLoading: guardando }] = useCambiarAjustesMutation();
  const [errorAlCambiar, setErrorAlCambiar] = useState<string | null>(null);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const ajustes = consulta.data;

  const guardados = useMemo<FormularioCierre | undefined>(() => ajustes && { mensaje: ajustes.mensajeCerrado }, [ajustes]);

  const form = useForm<FormularioCierre>({
    resolver: zodResolver(formularioCierreSchema),
    defaultValues: VACIO,
    // Se llena con lo guardado apenas llega, sin pisar lo que el dueño ya empezó a escribir
    values: guardados,
    resetOptions: { keepDirtyValues: true },
  });
  const mensaje = useWatch({ control: form.control, name: 'mensaje' });

  /** Abrir o cerrar: se ve en el momento; si el back no lo guarda, vuelve atrás y queda el error */
  const cambiar = async (cambios: CambiosAjustes) => {
    setErrorAlCambiar(null);
    try {
      await cambiarAjustes(cambios).unwrap();
    } catch (e) {
      setErrorAlCambiar(mensajeDeError(e));
    }
  };

  const guardarMensaje = form.handleSubmit(async (valores) => {
    setErrorMensaje(null);
    setMensajeGuardado(false);
    try {
      const guardado = await cambiarAjustes({ mensajeCerrado: valores.mensaje }).unwrap();
      form.reset({ mensaje: guardado.mensajeCerrado });
      setMensajeGuardado(true);
    } catch (e) {
      setErrorMensaje(mensajeDeError(e));
    }
  });

  return {
    /** Cómo está hoy en el back */
    cerrado: ajustes?.cerrado ?? false,
    errorAlCambiar,
    // Se confirma: desde ese momento nadie puede hacer un pedido por la web
    cerrar: () =>
      Alert.alert(
        'Cerrar la web',
        'Los clientes van a ver el cartel de cerrado en lugar del catálogo y no van a poder hacer pedidos hasta que elijas Vidriera o Carta. Tus productos no se tocan.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar la web', style: 'destructive', onPress: () => void cambiar({ cerrado: true }) },
        ],
      ),
    /** Vuelve a abrir la web; con `estiloCatalogo`, en el mismo cambio elige cómo se ve */
    abrir: (cambios: CambiosAjustes = {}) => cambiar({ ...cambios, cerrado: false }),
    /** El mensaje del cartel: se escribe y se guarda aparte, con su botón */
    mensaje: {
      control: form.control,
      /** Lo que se está escribiendo, o el de por defecto si está vacío */
      vistaPrevia: mensajeParaMostrar(mensaje),
      hayCambios: form.formState.isDirty,
      guardando,
      guardado: mensajeGuardado,
      error: errorMensaje,
      guardar: () => void guardarMensaje(),
    },
  };
}

/** Lo que necesita el editor del mensaje (`EditorMensajeCierre`) */
export type MensajeCierre = ReturnType<typeof useCierre>['mensaje'];
