const formato = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

/** Una fecha → "miércoles 15 de octubre" */
export function formatearFecha(fecha: Date): string {
  return formato.format(fecha).replace(',', '');
}
