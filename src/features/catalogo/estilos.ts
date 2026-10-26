import type { EstiloCatalogo } from './types';

export interface InfoEstiloCatalogo {
  estilo: EstiloCatalogo;
  nombre: string;
  /** Lo que la distingue, para elegir en Más → Preferencias */
  descripcion: string;
}

/** Los estilos del catálogo, en el orden en que se eligen */
export const ESTILOS_CATALOGO: Record<EstiloCatalogo, InfoEstiloCatalogo> = {
  vidriera: {
    estilo: 'vidriera',
    nombre: 'Vidriera',
    descripcion: 'Una grilla de fotos grandes, con buscador y filtros por tipo y por gusto. Luce con buenas fotos',
  },
  carta: {
    estilo: 'carta',
    nombre: 'Carta',
    descripcion: 'Agrupada por tipo, con la descripción a la vista y el precio a la derecha',
  },
};

/** El mismo que usa el back mientras el dueño no elige otro */
export const ESTILO_CATALOGO_POR_DEFECTO: EstiloCatalogo = 'carta';

export const esEstiloCatalogo = (valor: string): valor is EstiloCatalogo => valor in ESTILOS_CATALOGO;
