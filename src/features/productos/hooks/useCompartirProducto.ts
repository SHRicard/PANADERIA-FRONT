import { useState } from 'react';
import { compartirEnWhatsApp, sePuedeCompartir } from '@/services/compartir';
import { fotoParaCompartir, textoParaCompartir } from '../paraCompartir';
import type { Producto } from '../types';

/**
 * El botón «Compartir por WhatsApp» del detalle: baja la portada (la primera vez) y abre WhatsApp con la foto, el
 * precio y el link al producto en la web. Ahí el dueño elige a quién mandarlo, o «Mi estado»
 */
export function useCompartirProducto(producto: Producto | undefined) {
  const [preparando, setPreparando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const compartir = async () => {
    if (!producto || preparando) return;
    setAviso(null);
    setPreparando(true);
    try {
      const resultado = await compartirEnWhatsApp({
        texto: textoParaCompartir(producto),
        archivo: fotoParaCompartir(producto),
      });
      if (resultado === 'sin-whatsapp') setAviso('No encontramos WhatsApp en este celular.');
    } catch {
      setAviso('No se pudo preparar el producto para compartir. Revisá tu internet y probá de nuevo.');
    } finally {
      setPreparando(false);
    }
  };

  return {
    // Pausado no: el link de la web diría «Este producto no está disponible»
    puedeCompartir: sePuedeCompartir && producto?.disponible === true,
    compartir: () => void compartir(),
    preparando,
    aviso,
  };
}
