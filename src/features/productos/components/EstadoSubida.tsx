import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { Alert, Button, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { FotoEnCola } from '../store/subidaFotosSlice';

interface EstadoSubidaProps {
  /** Las fotos del producto que todavía no están en el servidor */
  enCola: FotoEnCola[];
  onReintentar: (ids: string[]) => void;
  onDescartar: (ids: string[]) => void;
}

/** "Subiendo 2 fotos…" o, si alguna falló, el error con Reintentar / Descartar. Sin fotos en la cola, nada */
export function EstadoSubida({ enCola, onReintentar, onDescartar }: EstadoSubidaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const subiendo = enCola.filter((foto) => foto.estado !== 'error');
  const conError = enCola.filter((foto) => foto.estado === 'error');
  const idsConError = conError.map((foto) => foto.idLocal);

  if (enCola.length === 0) return null;

  return (
    <View style={styles.estado}>
      {subiendo.length > 0 && (
        <View style={styles.subiendo} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text variant="caption" color="textMuted">
            {subiendo.length === 1 ? 'Subiendo 1 foto…' : `Subiendo ${subiendo.length} fotos…`}
          </Text>
        </View>
      )}

      {conError.length > 0 && (
        <View style={styles.errores}>
          <Alert
            tone="danger"
            title={conError.length === 1 ? 'Una foto no se subió' : `${conError.length} fotos no se subieron`}
            message={conError[0].error ?? 'Probá de nuevo.'}
          />
          <View style={styles.acciones}>
            <Button variant="secondary" icon={RotateCcw} label="Reintentar" onPress={() => onReintentar(idsConError)} />
            <Button variant="ghost" label="Descartar" onPress={() => onDescartar(idsConError)} />
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    estado: { gap: theme.spacing.sm },
    subiendo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    errores: { gap: theme.spacing.sm },
    acciones: { flexDirection: 'row', gap: theme.spacing.sm },
  });
