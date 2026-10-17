import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, CircleFadingPlus } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { textoPublicaciones } from '../textos';
import type { Promo } from '../types';
import { VistaPromo } from './VistaPromo';

interface TarjetaPromoProps {
  promo: Promo;
  /** Abre la edición */
  onAbrir: () => void;
  /** Sin el botón de compartir (la web, donde no se puede) */
  puedeCompartir: boolean;
  onCompartir: () => void;
  /** Esta promo se está preparando para compartir (la primera vez baja el archivo) */
  preparando: boolean;
  /** Otra promo se está preparando: de a una */
  bloqueado: boolean;
}

/**
 * Una promo en la biblioteca: la miniatura, el título, el texto en un renglón y cuántas veces se compartió. Tocarla
 * abre la edición; el botón verde, aparte (un botón no va adentro de otro), la comparte en el estado
 */
export function TarjetaPromo({ promo, onAbrir, puedeCompartir, onCompartir, preparando, bloqueado }: TarjetaPromoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.tarjeta}>
      <Pressable
        onPress={onAbrir}
        accessibilityRole="button"
        accessibilityLabel={`${promo.titulo}, ${promo.tipo === 'video' ? 'video' : 'foto'}`}
        accessibilityHint="Editar la promo"
        style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
      >
        <VistaPromo tipo={promo.tipo} uri={promo.miniatura} duracionSegundos={promo.duracionSegundos} lado={theme.sizes.miniatura} />
        <View style={styles.datos}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {promo.titulo}
          </Text>
          {promo.texto ? (
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {/* Los saltos de línea, como espacios: así entra más en el renglón */}
              {promo.texto.replace(/\s*\n+\s*/g, ' ')}
            </Text>
          ) : null}
          <Text variant="caption" color="textMuted">
            {textoPublicaciones(promo)}
          </Text>
        </View>
        <View style={styles.flecha}>
          <Icon icon={ChevronRight} color="textMuted" />
        </View>
      </Pressable>

      {puedeCompartir && (
        <Button
          variant="success"
          icon={CircleFadingPlus}
          label="Compartir en mi estado"
          onPress={onCompartir}
          loading={preparando}
          disabled={bloqueado && !preparando}
          accessibilityHint="Abre WhatsApp con la foto o el video y el texto"
          fullWidth
        />
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    fila: { flexDirection: 'row', gap: theme.spacing.md },
    presionada: { opacity: theme.opacity.pressed },
    datos: { flex: 1, gap: theme.spacing.xxs },
    flecha: { justifyContent: 'center' },
  });
