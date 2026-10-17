import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError, type ApiError } from '@/services/api';
import { formatearPrecio } from '@/shared/utils';
import {
  useCancelarPedidoMutation,
  useObtenerPedidoQuery,
  useQuitarCancelacionMutation,
  useQuitarEntregaMutation,
  useQuitarSenaMutation,
  useRegistrarEntregaMutation,
  useRegistrarSenaMutation,
} from '../api/pedidosApi';
import { formularioSenaSchema } from '../schemas';
import { linkWhatsApp, mensajeListo, mensajeSaludo } from '../textos';
import type { FormularioSena } from '../types';

type Accion = 'sena' | 'quitarSena' | 'entrega' | 'quitarEntrega' | 'cancelar' | 'quitarCancelacion';

/** El detalle de un pedido con sus pasos: confirmar la seña, entregar, cancelar y deshacer cada uno */
export function useDetallePedido(id: string) {
  const router = useRouter();
  const consulta = useObtenerPedidoQuery(id);
  const pedido = consulta.data;

  const [registrarSena] = useRegistrarSenaMutation();
  const [quitarSena] = useQuitarSenaMutation();
  const [registrarEntrega] = useRegistrarEntregaMutation();
  const [quitarEntrega] = useQuitarEntregaMutation();
  const [cancelarPedido] = useCancelarPedidoMutation();
  const [quitarCancelacion] = useQuitarCancelacionMutation();

  /** La acción que está esperando respuesta: su botón muestra el spinner y los demás no se pueden tocar */
  const [enCurso, setEnCurso] = useState<Accion | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Con seña ya pagada, el campo del monto se abre solo para corregirlo */
  const [corrigiendoSena, setCorrigiendoSena] = useState(false);

  const form = useForm<FormularioSena>({
    resolver: zodResolver(formularioSenaSchema),
    defaultValues: { monto: '' },
  });

  const ejecutar = async (accion: Accion, hacer: () => Promise<unknown>) => {
    setError(null);
    setEnCurso(accion);
    try {
      await hacer();
      return true;
    } catch (e) {
      // 409: el pedido ya había cambiado (otro toque, otro dispositivo). Se recarga para mostrar cómo quedó
      if ((e as Partial<ApiError>).status === 409) void consulta.refetch();
      setError(mensajeDeError(e));
      return false;
    } finally {
      setEnCurso(null);
    }
  };

  const confirmarSena = form.handleSubmit(async ({ monto }) => {
    if (!pedido) return;
    const pesos = Number(monto);
    if (pesos > pedido.total) {
      form.setError('monto', { message: `No puede ser más que el total (${formatearPrecio(pedido.total)})` });
      return;
    }
    if (await ejecutar('sena', () => registrarSena({ id, monto: pesos }).unwrap())) {
      setCorrigiendoSena(false);
      form.reset({ monto: '' });
    }
  });

  return {
    pedido,
    cargando: consulta.isLoading,
    /** Un 404 no es una falla: el pedido no existe */
    noExiste: (consulta.error as Partial<ApiError> | undefined)?.status === 404,
    errorCarga: consulta.error ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },

    enCurso,
    error,
    form,
    confirmarSena,
    corrigiendoSena,
    corregirSena: () => {
      form.reset({ monto: pedido?.sena ? String(pedido.sena.monto) : '' });
      setCorrigiendoSena(true);
    },
    dejarDeCorregir: () => setCorrigiendoSena(false),
    quitarSena: () => void ejecutar('quitarSena', () => quitarSena(id).unwrap()),
    entregar: () => void ejecutar('entrega', () => registrarEntrega(id).unwrap()),
    deshacerEntrega: () => void ejecutar('quitarEntrega', () => quitarEntrega(id).unwrap()),
    cancelar: () =>
      Alert.alert('¿Cancelar el pedido?', pedido?.sena ? 'La seña queda registrada, por si hay que devolverla.' : undefined, [
        { text: 'No', style: 'cancel' },
        { text: 'Cancelar pedido', style: 'destructive', onPress: () => void ejecutar('cancelar', () => cancelarPedido(id).unwrap()) },
      ]),
    deshacerCancelacion: () => void ejecutar('quitarCancelacion', () => quitarCancelacion(id).unwrap()),

    /** Abre el chat del cliente con un saludo escrito («¡Hola María! ¿Cómo estás?…»), para charlar */
    escribirAlCliente: () => {
      if (pedido) void Linking.openURL(linkWhatsApp(pedido.clienteTelefono, mensajeSaludo(pedido)));
    },
    /** Abre el chat del cliente con «Tu pedido ya está listo para retirar» escrito: el dueño solo lo manda */
    avisarListo: () => {
      if (pedido) void Linking.openURL(linkWhatsApp(pedido.clienteTelefono, mensajeListo(pedido)));
    },
    volver: () => (router.canGoBack() ? router.back() : router.replace('/pedidos')),
  };
}
