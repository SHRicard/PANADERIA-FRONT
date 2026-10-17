import { useState } from 'react';
import { useRegistrarPublicacionMutation } from '../api/promosApi';
import { compartirEnEstado, sePuedeCompartir } from '../compartir';
import { textoParaCompartir } from '../textos';
import type { Promo } from '../types';

/**
 * El botón «Compartir en mi estado»: baja el archivo (la primera vez), abre WhatsApp con la foto o el video y el texto,
 * y le avisa al back. En WhatsApp quedan dos toques: «Mi estado» y «Enviar»
 */
export function useCompartirPromo() {
  const [registrar] = useRegistrarPublicacionMutation();
  /** El id de la promo que se está preparando (bajando), para mostrar la espera en su botón */
  const [preparando, setPreparando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const compartir = async (promo: Promo) => {
    if (preparando) return;
    setAviso(null);
    setPreparando(promo._id);
    try {
      const resultado = await compartirEnEstado(promo, textoParaCompartir(promo));
      if (resultado === 'sin-whatsapp') {
        setAviso('No encontramos WhatsApp en este celular.');
        return;
      }
      // No se espera: WhatsApp ya está abierto. Si falla, la promo igual se compartió; solo queda sin contar
      void registrar(promo._id);
    } catch {
      setAviso('No se pudo preparar la promo para compartir. Revisá tu internet y probá de nuevo.');
    } finally {
      setPreparando(null);
    }
  };

  return { compartir, preparando, aviso, sePuedeCompartir };
}
