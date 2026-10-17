// Lo que usa la app del dueño: elegir cómo se ve el catálogo de la web
export { ESTILO_CATALOGO_POR_DEFECTO, ESTILOS_CATALOGO, type InfoEstiloCatalogo } from './estilos';
export { useEstiloCatalogo } from './hooks/useEstiloCatalogo';
// Lo que usa el pedido: con cuántas horas se encarga cada producto
export { useAnticipaciones, type Anticipacion } from './hooks/useAnticipaciones';
export type { EstiloCatalogo } from './types';
