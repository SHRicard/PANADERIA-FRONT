// Lo que usa la web: la puerta que muestra el cartel en lugar de las pantallas públicas si el negocio está cerrado
export { NegocioAbierto } from './components/NegocioAbierto';
// Lo que usa Preferencias → Web: «Cerrado» como opción del catálogo, y el mensaje del cartel
export { EditorMensajeCierre } from './components/EditorMensajeCierre';
export { useCierre, type MensajeCierre } from './hooks/useCierre';
// Lo que usa el inicio del dueño: el aviso de que la web está cerrada, y su consulta para refrescarlo
export { AvisoWebCerrada } from './components/AvisoWebCerrada';
export { useEstadoNegocio } from './hooks/useEstadoNegocio';
// Lo que usa Diseño del sistema: el cartel con el mensaje por defecto
export { CartelPuerta } from './components/CartelPuerta';
export { MENSAJE_CERRADO_POR_DEFECTO } from './textos';
