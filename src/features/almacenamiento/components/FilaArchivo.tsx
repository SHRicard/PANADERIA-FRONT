import { StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Button, Miniatura, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { detalleArchivo, tituloArchivo } from '../textos';
import type { ArchivoAlmacenado } from '../types';

interface FilaArchivoProps {
  archivo: ArchivoAlmacenado;
  /** Este archivo se está borrando */
  borrando: boolean;
  /** Se está borrando otro: de a uno */
  bloqueado: boolean;
  onBorrar: () => void;
}

/** Un archivo de la lista: su miniatura, de qué es, cuánto ocupa y el botón para borrarlo */
export function FilaArchivo({ archivo, borrando, bloqueado, onBorrar }: FilaArchivoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const titulo = tituloArchivo(archivo);

  return (
    <View style={styles.fila}>
      <Miniatura uri={archivo.miniatura} lado={theme.sizes.miniatura} />
      <View style={styles.textos}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {titulo}
        </Text>
        <Text variant="caption" color="textMuted">
          {detalleArchivo(archivo)}
        </Text>
      </View>
      <Button
        variant="danger"
        size="sm"
        icon={Trash2}
        label="Borrar"
        onPress={onBorrar}
        loading={borrando}
        disabled={bloqueado && !borrando}
        accessibilityLabel={`Borrar ${archivo.origen === 'promo' ? 'la promo' : 'la foto de'} ${titulo}`}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
