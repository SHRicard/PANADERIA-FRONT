import { StyleSheet, View } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import { Alert, Button, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { AuthEncabezado } from '../components/AuthEncabezado';
import { CampoContrasena } from '../components/CampoContrasena';
import { CampoTexto } from '../components/CampoTexto';
import { useRestablecer } from '../hooks/useRestablecer';
import { PASSWORD_MIN } from '../schemas';

export function RestablecerScreen() {
  const styles = useStyles(createStyles);
  const {
    email,
    control,
    enfocar,
    enviar,
    enviando,
    error,
    aviso,
    reenviar,
    reenviando,
    puedeReenviar,
    esperaReenvio,
    pedirOtroCodigo,
  } = useRestablecer();

  // Se llega acá sin email si la app se reinició a mitad de camino: hay que pedir el código de nuevo
  if (!email) {
    return (
      <ScreenContainer width="form" centered>
        <View style={styles.contenido}>
          <AuthEncabezado titulo="Nueva contraseña" descripcion="Primero pedí un código para tu email." />
          <Button label="Pedir un código" onPress={pedirOtroCodigo} fullWidth />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" centered>
      <View style={styles.contenido}>
        <AuthEncabezado
          titulo="Nueva contraseña"
          descripcion={`Si ${email} es el email de la cuenta, te llegó un código de 6 números. Vence en 15 minutos.`}
        />

        {error && <Alert tone="danger" message={error} />}
        {aviso && <Alert tone="success" message={aviso} />}

        <View style={styles.campos}>
          <CampoTexto
            control={control}
            name="codigo"
            label="Código"
            icon={KeyRound}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => enfocar('password')}
          />
          <CampoContrasena
            control={control}
            name="password"
            label="Contraseña nueva"
            helper={`Al menos ${PASSWORD_MIN} caracteres.`}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => enfocar('confirmacion')}
          />
          <CampoContrasena
            control={control}
            name="confirmacion"
            label="Repetí la contraseña nueva"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={enviar}
          />
        </View>

        <View style={styles.acciones}>
          <Button label="Cambiar contraseña" onPress={enviar} loading={enviando} fullWidth />
          <Button
            variant="ghost"
            label={puedeReenviar ? 'Reenviar el código' : `Reenviar el código en ${esperaReenvio}`}
            onPress={reenviar}
            loading={reenviando}
            disabled={!puedeReenviar}
          />
          <Button variant="ghost" label="Usar otro email" onPress={pedirOtroCodigo} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    campos: { gap: theme.spacing.lg },
    acciones: { gap: theme.spacing.sm },
  });
