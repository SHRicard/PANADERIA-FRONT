import { StyleSheet, View } from 'react-native';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { Alert, Button, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { AuthEncabezado } from '../components/AuthEncabezado';
import { CampoTexto } from '../components/CampoTexto';
import { useRecuperar } from '../hooks/useRecuperar';

export function RecuperarScreen() {
  const styles = useStyles(createStyles);
  const { control, enviar, enviando, error, volver } = useRecuperar();

  return (
    <ScreenContainer width="form" centered>
      <View style={styles.contenido}>
        <AuthEncabezado
          titulo="Recuperar contraseña"
          descripcion="Escribí el email de la cuenta y te mandamos un código de 6 números para elegir una contraseña nueva."
        />

        {error && <Alert tone="danger" message={error} />}

        <CampoTexto
          control={control}
          name="email"
          label="Email"
          icon={Mail}
          placeholder="nombre@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={enviar}
        />

        <View style={styles.acciones}>
          <Button label="Mandar código" onPress={enviar} loading={enviando} fullWidth />
          <Button variant="ghost" icon={ArrowLeft} label="Volver al login" onPress={volver} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    acciones: { gap: theme.spacing.sm },
  });
