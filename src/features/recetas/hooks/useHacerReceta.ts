import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { mensajeDeError } from '@/services/api';
import { esSinReceta, useCalcularProduccionQuery, useObtenerRecetaQuery } from '../api/recetasApi';
import { errorDeUnidades, leerUnidades } from '../produccion';

// Espera a que el dueño deje de escribir: no un pedido por número ("2", "24", "240")
const ESPERA_MS = 350;

/**
 * Realizar la receta: el dueño escribe cuántas unidades tiene que hacer y ve cuánto hace falta de cada ingrediente
 * (24 chipás de una receta de 12 = la receta ×2). Con el campo vacío, la receta de siempre
 */
export function useHacerReceta(productoId: string) {
  const consultaReceta = useObtenerRecetaQuery(productoId);
  const [texto, setTexto] = useState('');
  const escritas = leerUnidades(texto);
  const [esperadas, setEsperadas] = useState<number | null>(null);

  useEffect(() => {
    if (escritas === null) return;
    const espera = setTimeout(() => setEsperadas(escritas), ESPERA_MS);
    return () => clearTimeout(espera);
  }, [escritas]);

  // Borrar el número vuelve enseguida a la receta de siempre; uno nuevo espera a que termine de escribir
  const unidades = escritas === null ? null : esperadas;
  const consulta = useCalcularProduccionQuery(unidades === null ? skipToken : { productoId, unidades });

  const sinReceta = esSinReceta(consultaReceta.error);
  const receta = sinReceta ? undefined : consultaReceta.data;
  // `data` y no `currentData`: mientras calcula otro número se sigue viendo el anterior (con sus unidades, así no
  // se confunde). Sin número, nada: se ve la receta de siempre
  const produccion = unidades === null ? undefined : consulta.data;

  return {
    receta,
    cargando: consultaReceta.isLoading,
    sinReceta,
    errorReceta: consultaReceta.error && !sinReceta ? mensajeDeError(consultaReceta.error) : null,
    reintentarReceta: () => void consultaReceta.refetch(),

    texto,
    setTexto,
    /** Por qué no sirve lo que escribió (se muestra abajo del campo) */
    errorUnidades: errorDeUnidades(texto),

    /** Para cuántas unidades es la lista que se ve: las de la cuenta, o el rinde de la receta si no escribió nada */
    para: produccion?.unidades ?? receta?.rinde ?? null,
    veces: produccion?.veces ?? 1,
    ingredientes: produccion?.ingredientes ?? receta?.ingredientes.map((i) => ({ ...i, redondeado: false })) ?? [],
    costoTotal: produccion ? produccion.costoTotal : (receta?.costoTotal ?? null),
    hayRedondeos: produccion?.ingredientes.some((i) => i.redondeado) ?? false,
    calculando: unidades !== null && consulta.isFetching,
    errorCalculo: unidades !== null && consulta.isError ? mensajeDeError(consulta.error) : null,
    reintentarCalculo: () => void consulta.refetch(),

    refrescar: async () => {
      // Un query salteado (sin número) no se puede volver a pedir
      await Promise.all([consultaReceta.refetch(), unidades !== null ? consulta.refetch() : undefined]);
    },
  };
}
