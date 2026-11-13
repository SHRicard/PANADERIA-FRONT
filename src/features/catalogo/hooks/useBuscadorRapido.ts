import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useListarCatalogoInfiniteQuery } from '../api/catalogoApi';

// Espera a que el cliente deje de escribir: no un pedido por letra (como el buscador del catálogo)
const ESPERA_BUSQUEDA_MS = 300;
// Una lista corta, para elegir de un vistazo
const RESULTADOS_MAX = 6;

/**
 * Buscar un producto y abrir su detalle de un toque: mientras escribe, la lista de los que coinciden (la misma búsqueda
 * del catálogo, `GET /api/catalogo?buscar=`; el back no distingue mayúsculas ni acentos). Sin texto, no pide nada
 */
export function useBuscadorRapido() {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    const espera = setTimeout(() => setBuscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [texto]);

  const consulta = useListarCatalogoInfiniteQuery({ buscar, limite: RESULTADOS_MAX }, { skip: !buscar });
  const resultados = buscar ? (consulta.data?.pages[0]?.productos ?? []) : [];
  const abrir = (id: string) => router.push({ pathname: '/producto/[id]', params: { id } });

  return {
    texto,
    setTexto,
    resultados,
    /** Escribió, y la búsqueda todavía no volvió (o está esperando que deje de escribir) */
    buscando: texto.trim() !== buscar || (Boolean(buscar) && consulta.isFetching),
    /** Buscó y no hay ninguno con ese nombre */
    sinResultados: Boolean(buscar) && !consulta.isFetching && !consulta.isError && resultados.length === 0,
    error: Boolean(buscar) && consulta.isError,
    abrir,
    /** Enter en el campo: abre el primero de la lista, si hay */
    abrirPrimero: () => {
      if (resultados[0]) abrir(resultados[0]._id);
    },
  };
}
