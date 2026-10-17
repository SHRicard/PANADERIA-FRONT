import { Pressable, StyleSheet, View } from 'react-native';
import { Shuffle, Sparkles, X } from 'lucide-react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';

interface IdeasRecomendacionProps {
  ideas: string[];
  alUsar: (idea: string) => void;
  alPedirOtras: () => void;
  alCerrar: () => void;
}

/** La lista de «Autorrecomendar», pegada al campo: cada idea, al tocarla, lo llena */
export function IdeasRecomendacion({ ideas, alUsar, alPedirOtras, alCerrar }: IdeasRecomendacionProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.lista} accessibilityLiveRegion="polite">
      <Text variant="caption" color="textMuted" style={styles.ayuda}>
        Tocá una para usarla. Después la podés cambiar a tu gusto.
      </Text>
      {ideas.map((idea) => (
        <Pressable
          key={idea}
          onPress={() => alUsar(idea)}
          accessibilityRole="button"
          accessibilityLabel={`Usar: ${idea}`}
          style={({ pressed }) => [styles.idea, pressed && styles.presionada]}
        >
          <Icon icon={Sparkles} size="sm" color="accent" />
          <Text style={styles.texto}>{idea}</Text>
        </Pressable>
      ))}
      <View style={styles.acciones}>
        <Button variant="ghost" size="sm" icon={Shuffle} label="Otras ideas" onPress={alPedirOtras} />
        <Button variant="ghost" size="sm" icon={X} label="Cerrar" onPress={alCerrar} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    lista: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    ayuda: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xs },
    idea: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minHeight: theme.sizes.touchMin,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    presionada: { backgroundColor: theme.colors.primarySoft },
    texto: { flex: 1 },
    acciones: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xxs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
  });
