// La fecha de la compra viaja como AAAA-MM-DD (un día, sin hora ni zona) y acá se escribe DD/MM/AAAA

// La misma cuenta que el back: "hoy" es el de Argentina aunque el celular esté en otra zona. en-CA da AAAA-MM-DD
const formatoDia = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
const formatoLargo = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Hoy, AAAA-MM-DD */
export function hoy(): string {
  return formatoDia.format(new Date());
}

/** "2026-10-15" → "15/10/2026", para el campo del formulario */
export function aEscrita(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

/** "15/10/2026" (o "5/1/2026") → "2026-10-15"; null si no es un día que existe */
export function deEscrita(texto: string): string | null {
  const partes = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(texto.trim());
  if (!partes) return null;
  const fecha = `${partes[3]}-${partes[2].padStart(2, '0')}-${partes[1].padStart(2, '0')}`;
  const dia = new Date(`${fecha}T00:00:00Z`);
  return !Number.isNaN(dia.getTime()) && dia.toISOString().slice(0, 10) === fecha ? fecha : null;
}

/** "2026-10-15" → "15 de octubre de 2026". Al mediodía, para que ninguna zona horaria lo corra de día */
export function fechaLarga(fecha: string): string {
  return formatoLargo.format(new Date(`${fecha}T12:00:00`));
}
