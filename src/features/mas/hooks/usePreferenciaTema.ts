import { useState } from 'react';
import { useCambiarAjustesMutation } from '@/features/ajustes';
import { mensajeDeError } from '@/services/api';
import { useThemeMode, type PreferenciaTema } from '@/theme';

/**
 * El tema del dueño: se ve en el momento en su app y se guarda en el back, que es de donde lo toma la web para todos
 * los clientes. Si el back lo rechaza, vuelve al de antes (lo acomoda `useTemaDelDueno` con los ajustes deshechos)
 */
export function usePreferenciaTema() {
  const { preferencia, cambiarPreferencia } = useThemeMode();
  const [cambiarAjustes, { isLoading: guardando }] = useCambiarAjustesMutation();
  const [error, setError] = useState<string | null>(null);

  const elegir = async (tema: PreferenciaTema) => {
    if (tema === preferencia) return;
    setError(null);
    const anterior = preferencia;
    cambiarPreferencia(tema);
    try {
      await cambiarAjustes({ tema }).unwrap();
    } catch (e) {
      cambiarPreferencia(anterior);
      setError(`No se pudo cambiar el tema de la web: ${mensajeDeError(e)}`);
    }
  };

  return { preferencia, elegir: (tema: PreferenciaTema) => void elegir(tema), guardando, error };
}
