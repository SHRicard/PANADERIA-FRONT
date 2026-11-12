import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError, type ApiError } from '@/services/api';
import { formatearPrecio } from '@/shared/utils';
import {
  useCancelarPedidoMutation,
  useMarcarVistoMutation,
  useObtenerPedidoQuery,
  useQuitarCancelacionMutation,
  useQuitarEntregaMutation,
  useQuitarSenaMutation,
  useQuitarVistoMutation,
  useRegistrarEntregaMutation,
  useRegistrarSenaMutation,
} from '../api/pedidosApi';
import { formularioSenaSchema } from '../schemas';
import { linkWhatsApp, mensajeListo, mensajeSaludo } from '../textos';
import type { FormularioSena } from '../types';

type Accion =
  | 'sena'
  | 'sinSena'
  | 'quitarSena'
  | 'entrega'
  | 'quitarEntrega'
  | 'cancelar'
  | 'quitarCancelacion'
  | 'visto'
  | 'quitarVisto';

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
  const [marcarVisto] = useMarcarVistoMutation();
  const [quitarVisto] = useQuitarVistoMutation();

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

  /** Lo confirma sin seña: el mismo PUT …/sena, con monto 0 */
  const confirmarSinSena = async () => {
    if (await ejecutar('sinSena', () => registrarSena({ id, monto: 0 }).unwrap())) {
      setCorrigiendoSena(false);
      form.reset({ monto: '' });
    }
  };

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
    confirmarSinSena: () => void confirmarSinSena(),
    corrigiendoSena,
    corregirSena: () => {
      // Sin seña (0), el campo arranca vacío: el formulario no acepta 0
      form.reset({ monto: pedido?.sena?.monto ? String(pedido.sena.monto) : '' });
      setCorrigiendoSena(true);
    },
    dejarDeCorregir: () => setCorrigiendoSena(false),
    quitarSena: () => void ejecutar('quitarSena', () => quitarSena(id).unwrap()),
    entregar: () => void ejecutar('entrega', () => registrarEntrega(id).unwrap()),
    deshacerEntrega: () => void ejecutar('quitarEntrega', () => quitarEntrega(id).unwrap()),
    cancelar: () =>
      Alert.alert('¿Cancelar el pedido?', pedido?.sena?.monto ? 'La seña queda registrada, por si hay que devolverla.' : undefined, [
        { text: 'No', style: 'cancel' },
        { text: 'Cancelar pedido', style: 'destructive', onPress: () => void ejecutar('cancelar', () => cancelarPedido(id).unwrap()) },
      ]),
    deshacerCancelacion: () => void ejecutar('quitarCancelacion', () => quitarCancelacion(id).unwrap()),
    /** Ya lo vio: deja de salir como nuevo en la lista y en el inicio */
    marcarVisto: () => void ejecutar('visto', () => marcarVisto(id).unwrap()),
    /** Por si lo marcó sin querer: vuelve a salir como nuevo */
    marcarNoVisto: () => void ejecutar('quitarVisto', () => quitarVisto(id).unwrap()),
    /** Sumar, sacar o cambiar productos. Solo con el pedido abierto. Al guardar vuelve acá, ya actualizado */
    editarProductos: () => router.push({ pathname: '/editar-pedido/[id]', params: { id } }),

    /** Abre el chat del cliente con un saludo escrito («¡Hola María! ¿Cómo estás?…»), para charlar */
    escribirAlCliente: () => {
      if (pedido) void Linking.openURL(linkWhatsApp(pedido.clienteTelefono, mensajeSaludo(pedido)));
    },
    /** Abre el chat del cliente con «Tu pedido ya está listo» escrito (para retirar o para que se lo lleven): el dueño solo lo manda */
    avisarListo: () => {
      if (pedido) void Linking.openURL(linkWhatsApp(pedido.clienteTelefono, mensajeListo(pedido)));
    },
    volver: () => (router.canGoBack() ? router.back() : router.replace('/pedidos')),
  };
}
