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
  'dia-navidad': {
    estilo: 'dia-navidad',
    nombre: 'Navidad de día',
    descripcion:
      'Una vidriera con luces y personajes navideños, sobre un fondo como papel de regalo. Con los colores de las fiestas también en el detalle y en el pedido',
  },
  'noche-navidad': {
    estilo: 'noche-navidad',
    nombre: 'Navidad de noche',
    descripcion:
      'Un cielo de noche con estrellas, nieve y personajes navideños, sobre un fondo de estrellitas. Con sus colores también en el detalle y en el pedido',
  },
};

/** El mismo que usa el back mientras el dueño no elige otro */
export const ESTILO_CATALOGO_POR_DEFECTO: EstiloCatalogo = 'carta';

export const esEstiloCatalogo = (valor: string): valor is EstiloCatalogo => valor in ESTILOS_CATALOGO;
