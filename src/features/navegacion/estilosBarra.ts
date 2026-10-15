import type { ComponentType } from 'react';
import { BarraBurbuja } from './components/BarraBurbuja';
import { BarraCapsula } from './components/BarraCapsula';
import { BarraCompleta } from './components/BarraCompleta';
import { BarraExpandida } from './components/BarraExpandida';
import { BarraFlotante } from './components/BarraFlotante';
import { BarraPiso } from './components/BarraPiso';
import type { BarraProps } from './pestanas';
import type { EstiloBarra } from './store/estiloBarraSlice';

export interface InfoEstiloBarra {
  estilo: EstiloBarra;
  nombre: string;
  descripcion: string;
  Barra: ComponentType<BarraProps>;
}

/** Los estilos de barra, en el orden en que se ofrecen. Lo usan la app, Preferencias y Diseño del sistema */
export const ESTILOS_BARRA: Record<EstiloBarra, InfoEstiloBarra> = {
  completa: {
    estilo: 'completa',
    nombre: 'Completa',
    descripcion: 'Ocupa todo el ancho, pegada abajo.',
    Barra: BarraCompleta,
  },
  flotante: {
    estilo: 'flotante',
    nombre: 'Flotante',
    descripcion: 'Flota sobre el fondo, con los cuatro nombres.',
    Barra: BarraFlotante,
  },
  expandida: {
    estilo: 'expandida',
    nombre: 'Expandida',
    descripcion: 'Flota y solo la pestaña activa muestra el nombre.',
    Barra: BarraExpandida,
  },
  // Las tres de abajo marcan la activa rellenando el ícono, en vez de una píldora detrás
  piso: {
    estilo: 'piso',
    nombre: 'Al piso',
    descripcion: 'Pegada abajo, de lado a lado. El ícono activo se rellena.',
    Barra: BarraPiso,
  },
  capsula: {
    estilo: 'capsula',
    nombre: 'Cápsula',
    descripcion: 'Despegada del piso, con sombra. El ícono activo se rellena.',
    Barra: BarraCapsula,
  },
  burbuja: {
    estilo: 'burbuja',
    nombre: 'Con burbuja',
    descripcion: 'El ícono activo sube a un círculo que se desliza al cambiar de pestaña.',
    Barra: BarraBurbuja,
  },
};
