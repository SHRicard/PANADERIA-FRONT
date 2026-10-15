import { useState } from 'react';
import type { FotoDelSelector } from '../components/SelectorFotos';
import { FOTOS_MAX } from '../schemas';
import type { FotoLocal } from '../types';
import { useElegirFotos } from './useElegirFotos';

/** Alta: las fotos se juntan acá y recién se suben cuando el producto existe (al guardar). La primera es la portada */
export function useFotosElegidas() {
  const [fotos, setFotos] = useState<FotoLocal[]>([]);
  const eleccion = useElegirFotos(FOTOS_MAX - fotos.length, (nuevas) =>
    setFotos((actuales) => [...actuales, ...nuevas].slice(0, FOTOS_MAX))
  );

  const quitar = (idLocal: string) => setFotos((actuales) => actuales.filter((foto) => foto.idLocal !== idLocal));

  /** La pasa al primer lugar: la primera foto es la portada */
  const hacerPortada = (idLocal: string) =>
    setFotos((actuales) => {
      const elegida = actuales.find((foto) => foto.idLocal === idLocal);
      return elegida ? [elegida, ...actuales.filter((foto) => foto !== elegida)] : actuales;
    });

  const delSelector: FotoDelSelector[] = fotos.map(({ idLocal, uri }) => ({
    clave: idLocal,
    uri,
    quitable: true,
    elegiblePortada: true,
  }));

  return { fotos, delSelector, ...eleccion, quitar, hacerPortada };
}
