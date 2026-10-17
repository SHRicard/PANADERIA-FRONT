import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useAnticipaciones } from '@/features/catalogo';
import { mensajeDeError, type ApiError } from '@/services/api';
import { textoAnticipacion } from '@/shared/utils';
import { useCrearPedidoMutation } from '../api/carritoApi';
import { formularioPedidoSchema } from '../schemas';
import { cobroDelPedido, entregaDelPedido } from '../sena';
import { pedidoConfirmado } from '../store/carritoSlice';
import type { FormularioPedido } from '../types';
import { useCarrito } from './useCarrito';
import { useCotizacion } from './useCotizacion';

/** La página «Tu pedido»: el carrito con los precios de hoy, los datos del cliente y confirmar */
export function usePedido() {
  const router = useRouter();
  const carrito = useCarrito();
  const { cotizacion, cotizando, error: errorCotizacion, quitados, refrescar } = useCotizacion(carrito.items);
  const [crearPedido, { isLoading: enviando }] = useCrearPedidoMutation();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  // Guardado: sobrevive a que el cliente se vaya a pagar la seña y el navegador descargue la pestaña
  const confirmado = useAppSelector((estado) => estado.carrito.confirmado);
  const { anticipacionDe, refrescar: refrescarAnticipaciones } = useAnticipaciones();

  const form = useForm<FormularioPedido>({
    resolver: zodResolver(formularioPedidoSchema),
    defaultValues: { nombre: '', telefono: '', nota: '' },
  });

  const confirmar = form.handleSubmit(async ({ nombre, telefono, nota }) => {
    setError(null);
    try {
      const pedido = await crearPedido({ cliente: { nombre, telefono }, items: carrito.items, nota: nota || undefined }).unwrap();
      dispatch(pedidoConfirmado(pedido));
      form.reset();
    } catch (e) {
      // Algo se pausó entre que armó el carrito y confirmó: se vuelve a cotizar y lo que no está se saca solo
      if ((e as Partial<ApiError>).status === 400) void refrescar();
      setError(mensajeDeError(e));
    }
  });

  return {
    carrito,
    cotizacion,
    cotizando,
    errorCotizacion,
    quitados,
    refrescar: async () => {
      await Promise.all([refrescar(), refrescarAnticipaciones()]);
    },
    /** La seña y el resto del carrito; null mientras se cotiza un cambio */
    cobro: cotizacion && !cotizando ? cobroDelPedido(cotizacion.total) : null,
    /** «Con 48 hs de anticipación» para cada producto; null si se pide en el momento o todavía no se sabe */
    anticipacionDe: (productoId: string) => {
      const anticipacion = anticipacionDe(productoId);
      return anticipacion ? textoAnticipacion(anticipacion.horas) : null;
    },
    /** Cuándo va a estar listo: lo marca el producto que más se demora */
    entrega: entregaDelPedido(
      carrito.items.map(({ productoId }) => productoId),
      anticipacionDe,
    ),
    /** Lo mismo, del pedido ya confirmado (el carrito ya se vació) */
    cobroConfirmado: confirmado ? cobroDelPedido(confirmado.total) : null,
    entregaConfirmado: confirmado
      ? entregaDelPedido(
          confirmado.items.map(({ producto }) => producto),
          anticipacionDe,
        )
      : null,
    form,
    confirmar,
    enviando,
    error,
    confirmado,
    // Si se entró directo (un link), no hay a dónde volver: va al catálogo
    volver: () => (router.canGoBack() ? router.back() : router.replace('/')),
    verCatalogo: () => router.replace('/'),
  };
}
