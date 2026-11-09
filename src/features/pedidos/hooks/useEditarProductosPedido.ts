import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import type { Producto } from '@/features/productos';
import { mensajeDeError, type ApiError } from '@/services/api';
import { formatearPrecio } from '@/shared/utils';
import { useEditarItemsPedidoMutation, useObtenerPedidoQuery } from '../api/pedidosApi';
import { MAX_PRODUCTOS_PEDIDO, MAX_UNIDADES_PRODUCTO } from '../schemas';
import { useBuscadorProductos } from './useBuscadorProductos';

/** Un producto del pedido mientras se edita */
export interface LineaEditada {
  productoId: string;
  nombre: string;
  /** Lo que ya estaba: el precio del pedido. Lo nuevo: el de hoy. Es la misma cuenta que hace el back */
  precio: number;
  cantidad: number;
  /** Ya estaba en el pedido */
  original: boolean;
}

/**
 * Editar los productos de un pedido abierto: arranca con los del pedido (no con la lista de productos: uno pudo
 * haberse borrado y su línea sigue valiendo) y suma los que elija del buscador. Guardar manda la lista completa
 */
export function useEditarProductosPedido(id: string) {
  const router = useRouter();
  const consulta = useObtenerPedidoQuery(id);
  const pedido = consulta.data;
  const [editarItemsPedido, { isLoading: guardando }] = useEditarItemsPedidoMutation();
  const [error, setError] = useState<string | null>(null);
  const buscador = useBuscadorProductos();

  /** Cantidad elegida por id de producto. 0 = se saca. Lo que no está acá, queda como en el pedido */
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  /** Los que sumó del buscador y no estaban en el pedido, con su precio de hoy */
  const [agregados, setAgregados] = useState<Record<string, Producto>>({});

  const lineas = useMemo<LineaEditada[]>(() => {
    const items = pedido?.items ?? [];
    const enPedido = new Set(items.map((item) => item.producto));
    return [
      ...items.map((item) => ({
        productoId: item.producto,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: cantidades[item.producto] ?? item.cantidad,
        original: true,
      })),
      // Si saca uno que ya estaba y lo vuelve a sumar del buscador, sigue siendo el original (con su precio)
      ...Object.values(agregados)
        .filter((producto) => !enPedido.has(producto._id))
        .map((producto) => ({
          productoId: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: cantidades[producto._id] ?? 0,
          original: false,
        })),
    ];
  }, [pedido, cantidades, agregados]);

  // Las del pedido se ven aunque estén en 0 (se pueden volver a sumar); las nuevas, solo mientras van
  const visibles = lineas.filter((linea) => linea.original || linea.cantidad > 0);
  const elegidas = lineas.filter((linea) => linea.cantidad > 0);
  const total = elegidas.reduce((suma, { precio, cantidad }) => suma + precio * cantidad, 0);
  const cantidadDe = (productoId: string) => lineas.find((linea) => linea.productoId === productoId)?.cantidad ?? 0;
  const hayCambios = lineas.some((linea) => {
    const antes = pedido?.items.find((item) => item.producto === linea.productoId)?.cantidad ?? 0;
    return linea.cantidad !== antes;
  });

  /** Para las filas del pedido y del buscador. El producto va solo desde el buscador (si es nuevo, lleva su precio) */
  const cambiarCantidad = (productoId: string, cantidad: number, producto?: Producto) => {
    setError(null);
    if (cantidad > 0 && cantidadDe(productoId) === 0 && elegidas.length >= MAX_PRODUCTOS_PEDIDO) {
      setError(`Un pedido puede tener hasta ${MAX_PRODUCTOS_PEDIDO} productos distintos`);
      return;
    }
    if (producto) setAgregados((actuales) => ({ ...actuales, [producto._id]: producto }));
    setCantidades((actuales) => ({ ...actuales, [productoId]: Math.min(Math.max(cantidad, 0), MAX_UNIDADES_PRODUCTO) }));
  };

  const guardar = async () => {
    if (!pedido) return;
    setError(null);
    if (elegidas.length === 0) {
      setError('El pedido tiene que tener al menos un producto. Si ya no va, cancelalo');
      return;
    }
    if (pedido.sena && total < pedido.sena.monto) {
      setError(`La seña (${formatearPrecio(pedido.sena.monto)}) es más que el nuevo total: corregila antes de sacar productos`);
      return;
    }
    try {
      await editarItemsPedido({
        id,
        items: elegidas.map(({ productoId, cantidad }) => ({ productoId, cantidad })),
      }).unwrap();
      // El detalle ya quedó actualizado en la caché
      router.back();
    } catch (e) {
      // 409: lo entregaron o lo cancelaron mientras tanto. Se recarga para que se vea cómo quedó
      if ((e as Partial<ApiError>).status === 409) void consulta.refetch();
      setError(mensajeDeError(e));
    }
  };

  return {
    pedido,
    cargando: consulta.isLoading,
    /** Un 404 no es una falla: el pedido no existe */
    noExiste: (consulta.error as Partial<ApiError> | undefined)?.status === 404,
    errorCarga: consulta.error ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    /** Solo pendiente o confirmado: el back responde 409 a los demás */
    sePuedeEditar: pedido?.estado === 'pendiente' || pedido?.estado === 'confirmado',
    /** Las del pedido (aunque estén en 0: se pueden volver a sumar) y las que sumó del buscador */
    lineas: visibles,
    cantidadDe,
    cambiarCantidad,
    /** Los que ya están en la lista de arriba: el buscador no los repite */
    enLista: new Set(visibles.map((linea) => linea.productoId)),
    buscador,
    total,
    /** Lo que va a faltar cobrar con el total nuevo */
    saldo: total - (pedido?.sena?.monto ?? 0),
    hayCambios,
    maxUnidades: MAX_UNIDADES_PRODUCTO,
    guardar: () => void guardar(),
    guardando,
    error,
    volver: () => (router.canGoBack() ? router.back() : router.replace({ pathname: '/pedidos/[id]', params: { id } })),
  };
}
