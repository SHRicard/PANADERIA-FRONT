// API pública de la feature: lo que usan las rutas y las otras features
export { BarraPestanas } from './components/BarraPestanas';
export { EncabezadoPantalla } from './components/EncabezadoPantalla';
export { PantallaPestana } from './components/PantallaPestana';
export type { AccionEncabezado, EncabezadoProps } from './encabezado';
export { ESTILOS_BARRA, type InfoEstiloBarra } from './estilosBarra';
export { ESTILOS_ENCABEZADO, type InfoEstiloEncabezado } from './estilosEncabezado';
export { useEstiloBarra } from './hooks/useEstiloBarra';
export { useEstiloEncabezado } from './hooks/useEstiloEncabezado';
export { PESTANAS_ADMIN, type BarraProps, type Pestana, type RutaPestana } from './pestanas';
export { ESTILO_BARRA_POR_DEFECTO, type EstiloBarra } from './store/estiloBarraSlice';
export { ESTILO_ENCABEZADO_POR_DEFECTO, type EstiloEncabezado } from './store/estiloEncabezadoSlice';
