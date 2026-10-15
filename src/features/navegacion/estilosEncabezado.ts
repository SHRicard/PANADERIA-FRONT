import type { ComponentType } from 'react';
import {
  BarraChicaCarta,
  BarraChicaCentrado,
  BarraChicaIcono,
  BarraChicaRevista,
  BarraChicaSimple,
} from './components/BarraChica';
import { EncabezadoCarta } from './components/EncabezadoCarta';
import { EncabezadoCentrado } from './components/EncabezadoCentrado';
import { EncabezadoIcono } from './components/EncabezadoIcono';
import { EncabezadoRevista } from './components/EncabezadoRevista';
import { EncabezadoSimple } from './components/EncabezadoSimple';
import type { EncabezadoProps } from './encabezado';
import type { EstiloEncabezado } from './store/estiloEncabezadoSlice';

export interface InfoEstiloEncabezado {
  estilo: EstiloEncabezado;
  nombre: string;
  descripcion: string;
  /** El grande, arriba del contenido */
  Encabezado: ComponentType<EncabezadoProps>;
  /** El que queda arriba al bajar */
  BarraChica: ComponentType<EncabezadoProps>;
}

/** Los estilos de encabezado, en el orden en que se ofrecen. Lo usan la app, Preferencias y Diseño del sistema */
export const ESTILOS_ENCABEZADO: Record<EstiloEncabezado, InfoEstiloEncabezado> = {
  revista: {
    estilo: 'revista',
    nombre: 'Revista',
    descripcion: 'A la izquierda, con la fecha de hoy y una línea fina abajo.',
    Encabezado: EncabezadoRevista,
    BarraChica: BarraChicaRevista,
  },
  carta: {
    estilo: 'carta',
    nombre: 'Carta',
    descripcion: 'Centrado, con el logo arriba y un adorno dorado bajo el título.',
    Encabezado: EncabezadoCarta,
    BarraChica: BarraChicaCarta,
  },
  simple: {
    estilo: 'simple',
    nombre: 'Simple',
    descripcion: 'El título con qué es el apartado y la línea dorada de lado a lado.',
    Encabezado: EncabezadoSimple,
    BarraChica: BarraChicaSimple,
  },
  centrado: {
    estilo: 'centrado',
    nombre: 'Centrado',
    descripcion: 'Todo al centro: el título, la línea dorada corta y qué es el apartado.',
    Encabezado: EncabezadoCentrado,
    BarraChica: BarraChicaCentrado,
  },
  icono: {
    estilo: 'icono',
    nombre: 'Con ícono',
    descripcion: 'El ícono de la pestaña al lado del título, y la línea dorada que se desvanece.',
    Encabezado: EncabezadoIcono,
    BarraChica: BarraChicaIcono,
  },
};
