// EXPO_PUBLIC_* se reemplaza en build time: hay que leerla así, literal, para que Expo la encuentre.
// En desarrollo, ./run.sh android redirige el puerto 3000 del celular a la compu, así que localhost anda.
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  // Render gratis se duerme: el primer pedido después de un rato puede tardar casi un minuto
  apiTimeoutMs: 60_000,
  // El link directo al WhatsApp del dueño (https://wa.me/549…): el botón para coordinar la seña en efectivo.
  // Vacío, la web no muestra el botón
  whatsappUrl: process.env.EXPO_PUBLIC_WHATSAPP_URL || '',
} as const;
