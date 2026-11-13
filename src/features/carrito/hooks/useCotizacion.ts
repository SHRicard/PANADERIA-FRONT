import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { useCotizarCarritoQuery } from '../api/carritoApi';
import { mensajeParaCliente } from '../errores';
import { quitarNoDisponibles } from '../store/carritoSlice';
import type { ItemCarrito } from '../types';

// Si el cliente toca «+» varias veces seguidas, se cotiza una sola vez al final
const ESPERA_COTIZAR_MS = 300;

/**
 * Los precios de hoy del carrito (POST /api/carrito). Lo que ya no está disponible lo saca del carrito
 * y lo cuenta en `quitados`, para avisarle al cliente
 */
export function useCotizacion(items: ItemCarrito[]) {
  const dispatch = useAppDispatch();
  const [pedidos, setPedidos] = useState(items);
  const [quitados, setQuitados] = useState(0);
  /** La última lista de no disponibles que ya se contó: cada respuesta del back se cuenta una sola vez */
  const [contados, setContados] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const espera = setTimeout(() => setPedidos(items), ESPERA_COTIZAR_MS);
    return () => clearTimeout(espera);
  }, [items]);

  // Con el carrito vacío no hace falta preguntar nada
  const consulta = useCotizarCarritoQuery(pedidos, { skip: pedidos.length === 0 });
  const noDisponibles = consulta.currentData?.noDisponibles;

  // Se cuentan al renderizar (el patrón de React para ajustar un estado cuando cambia un dato), no en un efecto:
  // así no hay un render de más con el número viejo
  if (noDisponibles !== contados) {
    setContados(noDisponibles);
    if (noDisponibles?.length) setQuitados(quitados + noDisponibles.length);
  }

  // Sacarlos del carrito sí es un efecto: cambia el store
  useEffect(() => {
    if (noDisponibles?.length) dispatch(quitarNoDisponibles(noDisponibles));
  }, [noDisponibles, dispatch]);

  return {
    cotizacion: items.length === 0 ? undefined : consulta.currentData,
    /** Hay cambios que todavía no se cotizaron, o se está cotizando */
    cotizando: items !== pedidos || consulta.isFetching,
    error: consulta.isError ? mensajeParaCliente(consulta.error) : null,
    /** Cuántos productos se sacaron porque ya no se pueden pedir */
    quitados,
    refrescar: async () => {
      if (pedidos.length > 0) await consulta.refetch();
    },
  };
}
