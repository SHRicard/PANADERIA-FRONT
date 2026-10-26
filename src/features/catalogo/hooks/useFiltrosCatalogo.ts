import { useEffect, useMemo, useState } from 'react';
import { useListarFiltrosCatalogoQuery } from '../api/catalogoApi';
import type { FiltrosCatalogo, OpcionFiltro } from '../types';

// Espera a que el cliente deje de escribir: no un pedido por letra
const ESPERA_BUSQUEDA_MS = 300;

/**
 * Los filtros de la web: el tipo (el principal), el gusto y el nombre. Los aplica el back; acá solo se guarda qué
 * eligió el cliente. Las opciones también vienen del back, ya sin los tipos ni los gustos sin productos activos
 */
export function useFiltrosCatalogo() {
  const [texto, setTexto] = useState('');
  const [buscar, setBuscar] = useState('');
  const [tipo, setTipo] = useState<string | null>(null);
  const [gusto, setGusto] = useState<string | null>(null);
  const opciones = useListarFiltrosCatalogoQuery();

  useEffect(() => {
    const espera = setTimeout(() => setBuscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(espera);
  }, [texto]);

  // Tal como vienen, pasadas a opciones para mostrar: el tipo viaja por _id, el gusto por nombre
  const tipos = useMemo<OpcionFiltro[]>(
    () => opciones.data?.tipos.map(({ _id, nombre, cantidad }) => ({ valor: _id, label: nombre, cantidad })) ?? [],
    [opciones.data],
  );
  const gustos = useMemo<OpcionFiltro[]>(
    () => opciones.data?.categorias.map(({ nombre, cantidad }) => ({ valor: nombre, label: nombre, cantidad })) ?? [],
    [opciones.data],
  );

  // Los filtros vacíos van en undefined: no viajan y no arman otra caché
  const consulta: FiltrosCatalogo = {
    buscar: buscar || undefined,
    tipo: tipo ?? undefined,
    categoria: gusto ?? undefined,
  };

  return {
    /** Lo que viaja al back */
    consulta,
    texto,
    setTexto,
    /** Lo que se está buscando de verdad (después de la espera), para los mensajes */
    buscando: buscar,
    tipo,
    setTipo,
    /** El nombre del tipo elegido, para mostrarlo */
    nombreTipo: tipos.find(({ valor }) => valor === tipo)?.label ?? null,
    gusto,
    setGusto,
    /** Los tipos con productos activos, por nombre, con cuántos tiene cada uno */
    tipos,
    /** Los gustos con productos activos, en el orden fijo, con cuántos tiene cada uno */
    gustos,
    /** Todos los productos activos: cada uno tiene un gusto, así que es la suma de los gustos */
    totalActivos: gustos.reduce((suma, { cantidad }) => suma + cantidad, 0),
    /** Ya llegaron las opciones y el dueño no les puso tipo a los productos activos: no hay filtro de tipo */
    sinTipos: opciones.isSuccess && tipos.length === 0,
    hayFiltros: Boolean(buscar || tipo || gusto),
    /** Cuántos de la hoja están puestos (la búsqueda ya se ve en su campo) */
    filtrosPuestos: (tipo ? 1 : 0) + (gusto ? 1 : 0),
    /** Saca el tipo y el gusto; la búsqueda queda */
    limpiarHoja: () => {
      setTipo(null);
      setGusto(null);
    },
    limpiar: () => {
      setTexto('');
      setBuscar('');
      setTipo(null);
      setGusto(null);
    },
    refrescarOpciones: async () => {
      await opciones.refetch();
    },
  };
}
