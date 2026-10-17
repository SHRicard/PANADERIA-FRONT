import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Banknote, Check, Copy, MessageCircle, Wallet } from 'lucide-react-native';
import { Button, Icon, Segmentado, Text, type OpcionSegmentado } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { usePagoSena } from '../hooks/usePagoSena';
import { cbuParaLeer } from '../pago';
import type { PedidoCreado } from '../types';

type FormaPago = 'transferencia' | 'efectivo';

const FORMAS: OpcionSegmentado<FormaPago>[] = [
  { valor: 'transferencia', label: 'Transferencia', icono: Wallet },
  { valor: 'efectivo', label: 'Efectivo', icono: Banknote },
];

interface PagoSenaProps {
  pedido: PedidoCreado;
  sena: number;
}

/**
 * «Pagá la seña», después de confirmar: dos pestañas, Transferencia y Efectivo, y abajo solo lo de la elegida.
 * Transferencia: el alias y el CBU en baldosas para copiar, y mandar el comprobante por WhatsApp. Efectivo:
 * escribirle al dueño por WhatsApp. Sin datos de pago, solo el WhatsApp; sin ninguno de los dos, nada
 */
export function PagoSena({ pedido, sena }: PagoSenaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const pago = usePagoSena(pedido, sena);
  const [forma, setForma] = useState<FormaPago>('transferencia');

  if (pago.cargando) return <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />;
  if (!pago.datos && !pago.whatsapp) return null;

  // Una baldosa por dato: lo que se copia, grande, con el botón cuadrado a la derecha
  const baldosa = (cual: string, etiqueta: string, valor: string, paraCopiar: string) => {
    const copiado = pago.copiado === cual;
    return (
      <View style={styles.baldosa}>
        <View style={styles.textos}>
          <Text variant="caption" color="textMuted">
            {etiqueta}
          </Text>
          <Text variant="subtitle" selectable style={styles.valor}>
            {valor}
          </Text>
        </View>
        {pago.puedeCopiar && (
          <Pressable
            onPress={() => void pago.copiar(cual, paraCopiar)}
            accessibilityRole="button"
            accessibilityLabel={copiado ? `${etiqueta} copiado` : `Copiar ${etiqueta.toLowerCase()}`}
            style={({ pressed }) => [styles.copiar, copiado && styles.copiado, pressed && styles.presionado]}
          >
            <Icon icon={copiado ? Check : Copy} color={copiado ? 'success' : 'primary'} />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.pago}>
      <View style={styles.titulo}>
        <Text variant="title" accessibilityRole="header" style={styles.textos}>
          Pagá la seña
        </Text>
        <Text variant="title" color="primary" style={styles.monto}>
          {formatearPrecio(sena)}
        </Text>
      </View>

      {!pago.datos && pago.whatsapp ? (
        // El dueño no cargó a dónde transferir: se coordina por WhatsApp
        <>
          <Text color="textMuted">Escribinos por WhatsApp y coordinamos cómo pagar la seña. El mensaje ya va con tu pedido.</Text>
          <Button variant="success" icon={MessageCircle} label="Escribir por WhatsApp" onPress={pago.whatsapp.coordinar} fullWidth />
        </>
      ) : pago.datos ? (
        <>
          {/* Sin WhatsApp no hay cómo coordinar el efectivo: solo la transferencia */}
          {pago.whatsapp && (
            <Segmentado opciones={FORMAS} valor={forma} alCambiar={setForma} accessibilityLabel="Cómo pagar la seña" />
          )}

          {forma === 'efectivo' && pago.whatsapp ? (
            <View style={styles.panel}>
              <Text color="textMuted">
                Escribinos por WhatsApp y coordinamos dónde y cuándo nos das la seña. El mensaje ya va con tu pedido.
              </Text>
              <Button variant="success" icon={MessageCircle} label="Escribir por WhatsApp" onPress={pago.whatsapp.efectivo} fullWidth />
            </View>
          ) : (
            <View style={styles.panel}>
              {baldosa('alias', 'Alias', pago.datos.alias, pago.datos.alias)}
              {baldosa('cbu', 'CBU o CVU', cbuParaLeer(pago.datos.cbu), pago.datos.cbu)}
              <Text color="textMuted">
                A nombre de <Text style={styles.fuerte}>{pago.datos.nombreCompleto}</Text>, en {pago.datos.billetera}.
              </Text>
              {pago.whatsapp && (
                <Button
                  variant="success"
                  icon={MessageCircle}
                  label="Mandar el comprobante por WhatsApp"
                  onPress={pago.whatsapp.comprobante}
                  fullWidth
                />
              )}
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    pago: { gap: theme.spacing.md, paddingTop: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.lg },
    titulo: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.md },
    textos: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    // La seña en la letra de texto en negrita (la de título es para nombres), en cifras parejas
    monto: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    panel: { gap: theme.spacing.sm },
    baldosa: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    valor: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    copiar: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    copiado: { borderColor: theme.colors.success, backgroundColor: theme.colors.successSoft },
    presionado: { opacity: theme.opacity.pressed },
    fuerte: { fontFamily: theme.fonts.textoNegrita, color: theme.colors.text },
  });
