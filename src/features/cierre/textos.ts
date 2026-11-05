/** Hasta cuántas letras puede tener el mensaje del cartel: el mismo tope que el back */
export const MAX_MENSAJE_CERRADO = 280;

/** Lo que dice el cartel si el dueño no escribió nada */
export const MENSAJE_CERRADO_POR_DEFECTO =
  'Por un motivo de fuerza mayor tuvimos que cerrar por unos días y no estamos tomando pedidos. Disculpá las molestias: muy pronto volvemos a hornear.';

/** El mensaje que escribió el dueño o, si lo dejó vacío, el de por defecto */
export const mensajeParaMostrar = (mensaje: string): string => mensaje.trim() || MENSAJE_CERRADO_POR_DEFECTO;

/** Lo que el cliente le manda al dueño desde el cartel, ya escrito: termina abierto para que siga escribiendo */
export const MENSAJE_WHATSAPP_CERRADO = '¡Hola! Vi en la web que por ahora están cerrados. Te quería consultar: ';
