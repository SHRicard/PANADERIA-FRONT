import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Palette, User } from 'lucide-react-native';
import { Alert, Button, CampoTexto, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { AuthEncabezado } from '../components/AuthEncabezado';
import { CampoContrasena } from '../components/CampoContrasena';
import { useLogin } from '../hooks/useLogin';

export function LoginScreen() {
  const styles = useStyles(createStyles);
  const router = useRouter();
  const { control, enfocar, enviar, enviando, error } = useLogin();

  return (
    <ScreenContainer width="form" centered>
      <View style={styles.contenido}>
        <AuthEncabezado titulo="Ingresar" descripcion="Gestioná los productos y las promos de la panadería." />

        {error && <Alert tone="danger" message={error} />}

        <View style={styles.campos}>
          <CampoTexto
            control={control}
            name="usuario"
            label="Usuario"
            icon={User}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => enfocar('password')}
          />
          <CampoContrasena
            control={control}
            name="password"
            label="Contraseña"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={enviar}
          />
        </View>

        <View style={styles.acciones}>
          <Button label="Ingresar" onPress={enviar} loading={enviando} fullWidth />
          <Button variant="ghost" label="¿Olvidaste tu contraseña?" onPress={() => router.push('/recuperar')} />
          {__DEV__ && (
            <Button variant="ghost" icon={Palette} label="Diseño del sistema" onPress={() => router.push('/diseno')} />
          )}
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
