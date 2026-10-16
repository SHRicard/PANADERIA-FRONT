import { useState } from 'react';
import { useCambiarAjustesMutation, useObtenerAjustesQuery } from '@/features/ajustes';
import { mensajeDeError } from '@/services/api';
import { ESTILO_CATALOGO_POR_DEFECTO, esEstiloCatalogo } from '../estilos';
import type { EstiloCatalogo } from '../types';

/**
 * El estilo del catálogo que eligió el dueño. Se guarda en el back (no en el celular) porque lo tiene
 * que ver la web. La web lo lee; la app del dueño, además, lo cambia
 */
export function useEstiloCatalogo() {
  const consulta = useObtenerAjustesQuery();
  const [cambiarAjustes] = useCambiarAjustesMutation();
  const [errorAlCambiar, setErrorAlCambiar] = useState<string | null>(null);
  const guardado = consulta.data?.estiloCatalogo;

  return {
    // Si el back todavía no respondió, falló o manda un estilo que esta versión no conoce: el de por defecto
    estilo: guardado && esEstiloCatalogo(guardado) ? guardado : ESTILO_CATALOGO_POR_DEFECTO,
    cargando: consulta.isLoading,
    error: consulta.isError ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    errorAlCambiar,
    /** Se ve en el momento; si el back no lo guarda, vuelve atrás y queda el error */
    cambiar: async (estilo: EstiloCatalogo) => {
      setErrorAlCambiar(null);
      try {
        await cambiarAjustes({ estiloCatalogo: estilo }).unwrap();
      } catch (e) {
        setErrorAlCambiar(mensajeDeError(e));
      }
    },
  };
}
