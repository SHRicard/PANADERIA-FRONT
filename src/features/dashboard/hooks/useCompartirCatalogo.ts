import { useState } from 'react';
import { Linking } from 'react-native';
import { config } from '@/config';
import { compartirEnWhatsApp, sePuedeCompartir } from '@/services/compartir';
import { linkParaMostrar, textoCatalogo } from '../textos';

/**
 * La tarjeta «Tu catálogo» del inicio: abre WhatsApp con el saludo y el link a la web, sin foto. Ahí el dueño elige
 * a quién mandarlo (el chat del cliente que le preguntó, un grupo o «Mi estado») y toca «Enviar». También abre la web
 * en el navegador, para ver lo que ven los clientes
 */
export function useCompartirCatalogo() {
  const [preparando, setPreparando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const compartir = async () => {
    if (preparando) return;
    setAviso(null);
    setPreparando(true);
    try {
      const resultado = await compartirEnWhatsApp({ texto: textoCatalogo() });
      if (resultado === 'sin-whatsapp') setAviso('No encontramos WhatsApp en este celular.');
    } catch {
      setAviso('No se pudo abrir WhatsApp. Probá de nuevo.');
    } finally {
      setPreparando(false);
    }
  };

  return {
    puedeCompartir: sePuedeCompartir,
    link: linkParaMostrar(config.webUrl),
    compartir: () => void compartir(),
    verCatalogo: () => void Linking.openURL(config.webUrl),
    preparando,
    aviso,
  };
}
