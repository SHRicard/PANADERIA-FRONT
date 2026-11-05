import { StyleSheet, View } from 'react-native';
import { Megaphone, Plus } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { TarjetaPromo } from '../components/TarjetaPromo';
import { useCompartirPromo } from '../hooks/useCompartirPromo';
import { usePromos } from '../hooks/usePromos';

// Más → Promos: la biblioteca para el estado de WhatsApp. El título lo pone el header del Stack
export function PromosScreen() {
  const styles = useStyles(createStyles);
  const lista = usePromos();
  const compartir = useCompartirPromo();
  const refresco = useRefrescar(lista.refrescar);
  const vacio = !lista.cargando && !lista.error && lista.promos.length === 0;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Armá cada promo una vez y compartila en tu estado de WhatsApp cuando quieras, sin buscarla en la galería.
        </Text>
        <Button icon={Plus} label="Nueva promo" onPress={lista.nueva} fullWidth />

        {compartir.aviso && <Alert tone="warning" message={compartir.aviso} />}

        {lista.cargando && !refresco.refrescando && <Cargando mensaje="Cargando promos…" llenarAlto style={styles.cargando} />}

        {lista.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={lista.error} />
            <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
          </View>
        )}

        {vacio && (
          <View style={styles.vacio}>
            <Icon icon={Megaphone} size="xl" color="textMuted" />
            <Text variant="subtitle" align="center">
              Todavía no armaste promos
            </Text>
            <Text color="textMuted" align="center">
              Tocá «Nueva promo» y elegí una foto o un video corto: por ejemplo, la de las medialunas que publicás seguido.
            </Text>
          </View>
        )}

        {lista.promos.map((promo) => (
          <TarjetaPromo
            key={promo._id}
            promo={promo}
            onAbrir={() => lista.abrir(promo)}
            puedeCompartir={compartir.sePuedeCompartir}
            onCompartir={() => void compartir.compartir(promo)}
            preparando={compartir.preparando === promo._id}
            bloqueado={compartir.preparando !== null}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xxl },
  });
