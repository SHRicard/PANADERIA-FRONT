import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store';
import { MAX_UNIDADES, ponerCantidad } from '../store/carritoSlice';

/** El carrito del navegador: qué productos y cuántos. Los precios los da la cotización (useCotizacion) */
export function useCarrito() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((estado) => estado.carrito.items);
  const cantidades = useMemo(() => Object.fromEntries(items.map(({ productoId, cantidad }) => [productoId, cantidad])), [items]);

  return {
    items,
    /** Unidades en total (2 tartas + 1 chipá = 3) */
    unidades: items.reduce((suma, { cantidad }) => suma + cantidad, 0),
    maxUnidades: MAX_UNIDADES,
    cantidadDe: (productoId: string): number => cantidades[productoId] ?? 0,
    /** Con 0 lo saca del carrito */
    cambiarCantidad: (productoId: string, cantidad: number) => dispatch(ponerCantidad({ productoId, cantidad })),
    abrirPedido: () => router.push('/pedido'),
  };
}
