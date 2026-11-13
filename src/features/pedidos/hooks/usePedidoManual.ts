import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import type { Producto } from '@/features/productos';
import { mensajeDeError } from '@/services/api';
import { formatearPrecio } from '@/shared/utils';
import { useCrearPedidoManualMutation, useListarClientesQuery } from '../api/pedidosApi';
import { formularioPedidoManualSchema, MAX_PRODUCTOS_PEDIDO, MAX_UNIDADES_PRODUCTO } from '../schemas';
import type { FormularioPedidoManual } from '../types';
import { useBuscadorProductos } from './useBuscadorProductos';
import { useCalendarioDueno } from './useCalendarioDueno';

const VACIO: FormularioPedidoManual = { nombre: '', telefono: '', nota: '', sena: '', conEnvio: false, fechaEntrega: '' };

/** Un producto elegido: se guarda entero para mostrarlo aunque la búsqueda cambie y ya no aparezca */
interface Elegido {
  producto: Producto;
  cantidad: number;
}

/**
 * Pedido manual, en Más: el dueño carga un pedido que le hicieron por WhatsApp o en persona. Elige el cliente
 * (uno que ya tiene o uno nuevo), los productos (también los pausados) y, si ya cobró la seña, el monto
 */
export function usePedidoManual() {
  const router = useRouter();
  const [crearPedidoManual, { isLoading: guardando }] = useCrearPedidoManualMutation();
  const clientes = useListarClientesQuery();
  const [error, setError] = useState<string | null>(null);
  const [errorProductos, setErrorProductos] = useState<string | null>(null);
  const [clienteElegido, setClienteElegido] = useState<string | null>(null);

  const form = useForm<FormularioPedidoManual>({
    resolver: zodResolver(formularioPedidoManualSchema),
    defaultValues: VACIO,
  });

  // ── El día: cualquiera (el dueño no tiene las reglas de la web), viendo cómo viene la agenda ──
  const calendario = useCalendarioDueno(null);

  // ── Productos: la lista del dueño (con los pausados), con búsqueda ──
  const buscador = useBuscadorProductos();

  const [elegidos, setElegidos] = useState<Record<string, Elegido>>({});
  const lista = Object.values(elegidos);
  // Con los precios de hoy: es lo que va a calcular el back al guardar
  const total = lista.reduce((suma, { producto, cantidad }) => suma + producto.precio * cantidad, 0);

  const cambiarCantidad = (producto: Producto, cantidad: number) => {
    setErrorProductos(null);
    if (cantidad > 0 && !elegidos[producto._id] && lista.length >= MAX_PRODUCTOS_PEDIDO) {
      setErrorProductos(`Un pedido puede tener hasta ${MAX_PRODUCTOS_PEDIDO} productos distintos`);
      return;
    }
    setElegidos((actuales) => {
      const { [producto._id]: _anterior, ...resto } = actuales;
      return cantidad > 0 ? { ...resto, [producto._id]: { producto, cantidad: Math.min(cantidad, MAX_UNIDADES_PRODUCTO) } } : resto;
    });
  };

  // Sin productos: se avisa junto con los errores del formulario (nombre, teléfono, día), no recién cuando están bien
  const revisarProductos = () => {
    if (lista.length > 0) return true;
    setErrorProductos('Elegí al menos un producto');
    return false;
  };

  const guardar = form.handleSubmit(async ({ nombre, telefono, nota, sena, conEnvio, fechaEntrega }) => {
    setError(null);
    if (!revisarProductos()) return;
    if (sena && Number(sena) > total) {
      form.setError('sena', { message: `No puede ser más que el total (${formatearPrecio(total)})` });
      return;
    }
    try {
      const pedido = await crearPedidoManual({
        cliente: { nombre, telefono },
        conEnvio,
        fechaEntrega,
        items: lista.map(({ producto, cantidad }) => ({ productoId: producto._id, cantidad })),
        ...(nota && { nota }),
        ...(sena && { sena: { monto: Number(sena) } }),
      }).unwrap();
      // Al detalle del pedido recién cargado (ya está en la caché). Volver lleva a Más
      router.replace({ pathname: '/pedidos/[id]', params: { id: pedido._id } });
    } catch (e) {
      setError(mensajeDeError(e));
    }
  }, revisarProductos);

  return {
    form,
    guardar,
    guardando,
    error,

    clientes: clientes.data ?? [],
    clienteElegido,
    /** Completa nombre y teléfono con los de un cliente que ya hizo pedidos. Se pueden cambiar igual */
    elegirCliente: (id: string) => {
      const cliente = clientes.data?.find((c) => c._id === id);
      if (!cliente) return;
      setClienteElegido(id);
      form.setValue('nombre', cliente.nombre, { shouldValidate: true });
      form.setValue('telefono', cliente.telefono, { shouldValidate: true });
    },

    buscador,
    calendario,

    elegidos: lista,
    cantidadDe: (id: string) => elegidos[id]?.cantidad ?? 0,
    cambiarCantidad,
    errorProductos,
    total,
    maxUnidades: MAX_UNIDADES_PRODUCTO,
  };
}
