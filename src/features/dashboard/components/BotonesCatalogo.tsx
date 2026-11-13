import { StyleSheet, View } from 'react-native';
import { ExternalLink, Share2 } from 'lucide-react-native';
import { Alert, Button } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useCompartirCatalogo } from '../hooks/useCompartirCatalogo';

/**
 * El atajo para mandar el link de la web (lo que más hace el dueño cuando un cliente le escribe) y para verla como
 * la ven los clientes. Dos botones en una fila, sin tarjeta: así la agenda entra mejor en el inicio
 */
export function BotonesCatalogo() {
  const styles = useStyles(createStyles);
  const catalogo = useCompartirCatalogo();

  if (!catalogo.puedeCompartir) return null;

  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <View style={styles.boton}>
          <Button
            variant="success"
            icon={Share2}
            label="Compartir"
            onPress={catalogo.compartir}
            loading={catalogo.preparando}
            accessibilityLabel="Compartir el catálogo por WhatsApp"
            accessibilityHint="Abre WhatsApp con un saludo y el link al catálogo"
            fullWidth
          />
        </View>
        <View style={styles.boton}>
          <Button
            variant="secondary"
            icon={ExternalLink}
            label="Ver catálogo"
            onPress={catalogo.verCatalogo}
            accessibilityLabel="Ver mi catálogo"
            accessibilityHint="Abre la web en el navegador, como la ven los clientes"
            fullWidth
          />
        </View>
      </View>

      {catalogo.aviso && <Alert tone="warning" message={catalogo.aviso} />}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenedor: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', gap: theme.spacing.sm },
    boton: { flex: 1 },
  });
