import { Pressable, StyleSheet, View } from 'react-native';
import { Moon, Sun, SunMoon, type LucideIcon } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useThemeMode, type PreferenciaTema, type Theme } from '@/theme';

const OPCIONES: { valor: PreferenciaTema; label: string; icono: LucideIcon }[] = [
  { valor: 'sistema', label: 'Sistema', icono: SunMoon },
  { valor: 'claro', label: 'Claro', icono: Sun },
  { valor: 'oscuro', label: 'Oscuro', icono: Moon },
];

export function SelectorTema() {
  const styles = useStyles(createStyles);
  const { preferencia, cambiarPreferencia } = useThemeMode();

  return (
    <View style={styles.selector} accessibilityRole="radiogroup" accessibilityLabel="Tema">
      {OPCIONES.map(({ valor, label, icono }) => {
        const activa = valor === preferencia;
        return (
          <Pressable
            key={valor}
            onPress={() => cambiarPreferencia(valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa }}
            accessibilityLabel={`Tema ${label.toLowerCase()}`}
            style={[styles.opcion, activa && styles.activa]}
          >
            <Icon icon={icono} size="sm" color={activa ? 'text' : 'textMuted'} />
            <Text variant="label" color={activa ? 'text' : 'textMuted'}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    selector: {
      flexDirection: 'row',
      gap: theme.spacing.xxs,
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceMuted,
    },
    opcion: {
      flex: 1,
      minHeight: theme.sizes.touchMin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activa: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  });
