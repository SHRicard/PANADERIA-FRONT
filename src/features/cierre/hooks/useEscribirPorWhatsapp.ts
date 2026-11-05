import { Linking } from 'react-native';
import { config } from '@/config';
import { enlaceWhatsapp } from '@/shared/utils';
import { MENSAJE_WHATSAPP_CERRADO } from '../textos';

/** El botón del cartel de cerrado: abre el WhatsApp del dueño con un mensaje ya empezado. No consulta al back */
export function useEscribirPorWhatsapp() {
  return {
    /** Sin el link de WhatsApp del dueño (`EXPO_PUBLIC_WHATSAPP_URL`) no hay botón */
    puedeEscribir: Boolean(config.whatsappUrl),
    escribir: () => void Linking.openURL(enlaceWhatsapp(config.whatsappUrl, MENSAJE_WHATSAPP_CERRADO)),
  };
}
