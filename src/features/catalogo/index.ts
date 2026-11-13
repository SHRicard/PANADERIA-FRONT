// Lo que usa la app del dueño: elegir cómo se ve el catálogo de la web
export { ESTILO_CATALOGO_POR_DEFECTO, ESTILOS_CATALOGO, type InfoEstiloCatalogo } from './estilos';
export { useEstiloCatalogo } from './hooks/useEstiloCatalogo';
// Lo que usa el pedido: con cuántas horas se encarga cada producto
export { useAnticipaciones, type Anticipacion } from './hooks/useAnticipaciones';
export type { EstiloCatalogo } from './types';
// Lo que usa el layout de la web: la vista previa del link al compartirlo (logo, título y descripción) y el tema del
// estilo de temporada (Navidad), que pinta el catálogo, el detalle y el pedido
export { EtiquetasVistaPrevia } from './components/EtiquetasVistaPrevia';
export { TemaCatalogo } from './components/TemaCatalogo';
// Lo que usa el pedido para vestirse de fiestas mientras el catálogo es de Navidad: si lo es y los dibujos, con su
// movimiento
export { useEsNavidad } from './hooks/useEsNavidad';
export { BotonFiestas } from './components/navidad/BotonFiestas';
export { Ilustracion as IlustracionNavidad } from './components/navidad/Ilustracion';
export { Destellos, Vivo, type Movimiento } from './components/navidad/adornos';
export type { NombreAssetNavidad } from './assetsNavidad';
