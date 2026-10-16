import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError, type ApiError } from '@/services/api';
import { useCrearPedidoMutation } from '../api/carritoApi';
import { formularioPedidoSchema } from '../schemas';
import type { FormularioPedido, PedidoCreado } from '../types';
import { useCarrito } from './useCarrito';
import { useCotizacion } from './useCotizacion';

/** La página «Tu pedido»: el carrito con los precios de hoy, los datos del cliente y confirmar */
export function usePedido() {
  const router = useRouter();
  const carrito = useCarrito();
  const { cotizacion, cotizando, error: errorCotizacion, quitados, refrescar } = useCotizacion(carrito.items);
  const [crearPedido, { isLoading: enviando }] = useCrearPedidoMutation();
  const [error, setError] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<PedidoCreado | null>(null);

  const form = useForm<FormularioPedido>({
    resolver: zodResolver(formularioPedidoSchema),
    defaultValues: { nombre: '', telefono: '', nota: '' },
  });

  const confirmar = form.handleSubmit(async ({ nombre, telefono, nota }) => {
    setError(null);
    try {
      const pedido = await crearPedido({ cliente: { nombre, telefono }, items: carrito.items, nota: nota || undefined }).unwrap();
      setConfirmado(pedido);
      carrito.vaciar();
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
    refrescar,
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
