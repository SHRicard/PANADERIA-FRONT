import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import type { FieldValues } from 'react-hook-form';
import { CampoTexto, Icon, type CampoTextoProps } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

type CampoContrasenaProps<T extends FieldValues> = Omit<
  CampoTextoProps<T>,
  'icon' | 'secureTextEntry' | 'accessoryRight'
>;

export function CampoContrasena<T extends FieldValues>(props: CampoContrasenaProps<T>) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [visible, setVisible] = useState(false);

  return (
    <CampoTexto
      icon={Lock}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      accessoryRight={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={theme.spacing.xs}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={styles.ojo}
        >
          <Icon icon={visible ? EyeOff : Eye} color="textMuted" />
        </Pressable>
      }
      {...props}
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Tocable de 44x44 sin agrandar el campo: se come el padding derecho del input
    ojo: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      marginRight: -theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
