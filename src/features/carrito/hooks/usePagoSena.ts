import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { config } from '@/config';
import { useObtenerDatosPagoQuery } from '@/features/datosPago';
import { enlaceWhatsapp, mensajeWhatsapp, type MotivoWhatsapp } from '../pago';
import type { PedidoCreado } from '../types';

// Cuánto se ve «Copiado» después de tocar «Copiar»
const COPIADO_MS = 2000;

// El portapapeles del navegador: la web es la única que muestra esto. Si no está, no hay botón de copiar
const portapapeles = (globalThis.navigator as { clipboard?: { writeText: (texto: string) => Promise<void> } } | undefined)
  ?.clipboard;

/**
 * Después del pedido: cómo pagar la seña. Los datos para transferir (si el dueño los cargó: si no, el back
 * responde 404 y no se muestran) y el WhatsApp del dueño para pagarla en efectivo
 */
export function usePagoSena(pedido: PedidoCreado, sena: number) {
  const consulta = useObtenerDatosPagoQuery();
  const [copiado, setCopiado] = useState<string | null>(null);
  const datos = consulta.data ?? null;

  useEffect(() => {
    if (!copiado) return;
    const espera = setTimeout(() => setCopiado(null), COPIADO_MS);
    return () => clearTimeout(espera);
  }, [copiado]);

  // Cada botón abre WhatsApp con su mensaje ya escrito
  const escribir = (motivo: MotivoWhatsapp) => () =>
    void Linking.openURL(enlaceWhatsapp(config.whatsappUrl, mensajeWhatsapp(pedido, sena, motivo)));

  return {
    datos,
    cargando: consulta.isLoading,
    /** null si no hay link de WhatsApp configurado */
    whatsapp: config.whatsappUrl
      ? { efectivo: escribir('efectivo'), comprobante: escribir('comprobante'), coordinar: escribir('coordinar') }
      : null,
    puedeCopiar: Boolean(portapapeles),
    /** Qué dato se acaba de copiar ('alias', 'cbu'), para decir «Copiado» un momento */
    copiado,
    copiar: async (cual: string, texto: string) => {
      try {
        await portapapeles?.writeText(texto);
        setCopiado(cual);
      } catch {
        // El navegador no dejó (sin permiso): el texto igual se puede seleccionar
      }
    },
  };
}
