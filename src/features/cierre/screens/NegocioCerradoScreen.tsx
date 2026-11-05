import { StyleSheet, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { Button, ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { CartelPuerta } from '../components/CartelPuerta';
import { useEscribirPorWhatsapp } from '../hooks/useEscribirPorWhatsapp';

interface NegocioCerradoScreenProps {
  /** El del dueño o el de por defecto. Llega por props: ver por qué en `useEstadoNegocio` */
  mensaje: string;
}

/**
 * Lo que ve el cliente en la web mientras el negocio está cerrado (o el back no responde), en cualquier link (el
 * catálogo, un producto, el pedido): el cartel con el mensaje y, si hay link, el botón para escribirle por WhatsApp.
 * No es una ruta: la pone `NegocioAbierto` en lugar de las pantallas públicas
 */
export function NegocioCerradoScreen({ mensaje }: NegocioCerradoScreenProps) {
  const styles = useStyles(createStyles);
  const whatsapp = useEscribirPorWhatsapp();

  return (
    <ScreenContainer centered>
      <View style={styles.contenido}>
        <CartelPuerta
          mensaje={mensaje}
          pie={
            whatsapp.puedeEscribir && (
              <View style={styles.boton}>
                <Button
                  variant="success"
                  icon={MessageCircle}
                  label="Escribinos por WhatsApp"
                  onPress={whatsapp.escribir}
                  accessibilityHint="Abre WhatsApp con un mensaje para consultar"
                  fullWidth
                />
              </View>
            )
          }
        />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { paddingVertical: theme.spacing.xl },
    boton: { width: '100%', maxWidth: theme.sizes.formMax },
  });
