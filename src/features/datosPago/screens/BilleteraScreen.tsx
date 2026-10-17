import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Alert, Button, CampoTexto, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { useBilletera } from '../hooks/useBilletera';

// Formulario: no lleva el gesto de refrescar. El título lo pone el header del Stack
export function BilleteraScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const billetera = useBilletera();

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          La cuenta a la que tus clientes te transfieren la seña. La web se la muestra apenas confirman el pedido.
        </Text>

        {billetera.cargando ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        ) : billetera.errorCarga ? (
          <View style={styles.error}>
            <Alert tone="danger" message={billetera.errorCarga} />
            <Button variant="secondary" label="Reintentar" onPress={billetera.reintentar} />
          </View>
        ) : (
          <View style={styles.campos}>
            {billetera.sinDatos && (
              <Alert tone="info" message="Todavía no cargaste los datos: la web no muestra a dónde transferir la seña." />
            )}
            <CampoTexto
              control={billetera.control}
              name="nombreCompleto"
              label="Titular de la cuenta"
              placeholder="Juan Pérez"
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => billetera.enfocar('alias')}
            />
            <CampoTexto
              control={billetera.control}
              name="alias"
              label="Alias"
              placeholder="pan.dulce.mp"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => billetera.enfocar('cbu')}
            />
            <CampoTexto
              control={billetera.control}
              name="cbu"
              label="CBU o CVU"
              placeholder="22 números"
              helper="Podés pegarlo con espacios o guiones: se guardan solo los números."
              keyboardType="number-pad"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => billetera.enfocar('billetera')}
            />
            <CampoTexto
              control={billetera.control}
              name="billetera"
              label="Billetera o banco"
              placeholder="Mercado Pago, Ualá, Banco Nación…"
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={billetera.guardar}
            />

            {billetera.guardado && <Alert tone="success" message="Listo: la web ya muestra estos datos." />}
            {billetera.error && <Alert tone="danger" message={billetera.error} />}

            <Button label="Guardar" onPress={billetera.guardar} loading={billetera.guardando} fullWidth />
            {billetera.hayDatos && (
              <Button
                variant="danger"
                icon={Trash2}
                label="Sacar de la web"
                onPress={billetera.sacarDeLaWeb}
                loading={billetera.borrando}
                fullWidth
              />
            )}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    campos: { gap: theme.spacing.lg },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
