import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleAlert } from 'lucide-react-native';
import { useStyles, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Input, type InputProps } from '../Input';
import { Text } from '../Text';

export interface InputFieldProps extends InputProps {
  label: string;
  /** Mensaje de error: pinta el campo en rojo y se muestra abajo, con ícono */
  error?: string;
  /** Ayuda que se muestra abajo cuando no hay error */
  helper?: string;
}

function InputFieldComponent({ label, error, helper, ...inputProps }: InputFieldProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.campo}>
      <Text variant="label">{label}</Text>
      <Input accessibilityLabel={label} accessibilityHint={error ?? helper} invalid={!!error} {...inputProps} />
      {error ? (
        <View style={styles.mensaje} accessibilityLiveRegion="polite">
          <Icon icon={CircleAlert} size="sm" color="danger" />
          <Text variant="caption" color="danger" style={styles.textoMensaje}>
            {error}
          </Text>
        </View>
      ) : (
        helper && (
          <Text variant="caption" color="textMuted">
            {helper}
          </Text>
        )
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.xs },
    mensaje: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    textoMensaje: { flex: 1 },
  });

export const InputField = memo(InputFieldComponent);
