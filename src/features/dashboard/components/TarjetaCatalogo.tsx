import { StyleSheet, View } from 'react-native';
import { ExternalLink, Share2, Store } from 'lucide-react-native';
import { Alert, Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useCompartirCatalogo } from '../hooks/useCompartirCatalogo';

/** El atajo para mandar el link de la web: lo que más hace el dueño cuando un cliente le escribe */
export function TarjetaCatalogo() {
  const styles = useStyles(createStyles);
  const catalogo = useCompartirCatalogo();

  if (!catalogo.puedeCompartir) return null;

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <View style={styles.icono}>
          <Icon icon={Store} size="lg" color="primary" />
        </View>
        <View style={styles.titulos}>
          <Text variant="title">Tu catálogo</Text>
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {catalogo.link}
          </Text>
        </View>
      </View>

      <Text color="textMuted">
        Mandáselo a quien te pregunte qué tenés: ve los productos con sus precios y te hace el pedido desde ahí.
      </Text>

      {catalogo.aviso && <Alert tone="warning" message={catalogo.aviso} />}

      <Button
        variant="success"
        icon={Share2}
        label="Compartir por WhatsApp"
        onPress={catalogo.compartir}
        loading={catalogo.preparando}
        accessibilityHint="Abre WhatsApp con un saludo y el link al catálogo"
        fullWidth
      />
      <Button
        variant="secondary"
        icon={ExternalLink}
        label="Ver mi catálogo"
        onPress={catalogo.verCatalogo}
        accessibilityHint="Abre la web en el navegador, como la ven los clientes"
        fullWidth
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    cabecera: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    icono: {
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.sizes.control,
      height: theme.sizes.control,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primarySoft,
    },
    titulos: { flex: 1, gap: theme.spacing.xxs },
  });
