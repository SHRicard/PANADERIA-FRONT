import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { recomendacionesAlAzar, sugerirRecomendaciones } from '@/shared/utils';
import type { FormularioRecomendacion } from '../types';

// Cuántas ideas se muestran de una vez
const IDEAS = 5;

/**
 * «Autorrecomendar»: ideas para el campo «¿Qué te pareció?». Si ya escribió algo, primero las que coinciden
 * (y el resto al azar); si no, todas al azar. Elegir una llena el campo
 */
export function useAutorrecomendar(form: UseFormReturn<FormularioRecomendacion>) {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [abierta, setAbierta] = useState(false);

  const autorrecomendar = () => {
    const coinciden = sugerirRecomendaciones(form.getValues('texto'), IDEAS);
    setIdeas([...coinciden, ...recomendacionesAlAzar(IDEAS - coinciden.length, coinciden)]);
    setAbierta(true);
  };

  return {
    ideas,
    abierta,
    autorrecomendar,
    /** Cinco nuevas, sin repetir las que está viendo */
    otrasIdeas: () => setIdeas((antes) => recomendacionesAlAzar(IDEAS, antes)),
    usar: (idea: string) => {
      form.setValue('texto', idea, { shouldDirty: true, shouldValidate: true });
      setAbierta(false);
    },
    cerrar: () => setAbierta(false),
  };
}
