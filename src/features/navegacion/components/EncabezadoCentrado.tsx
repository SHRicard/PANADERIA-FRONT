import { StyleSheet, View } from 'react-native';
import { Adorno, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { EncabezadoProps } from '../encabezado';
import { BotonRedondo } from './BotonRedondo';

/** Todo al centro: el título, la línea dorada corta y qué es el apartado. El botón redondo, en la esquina */
export function EncabezadoCentrado({ titulo, subtitulo, accion }: EncabezadoProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.encabezado}>
      <Text variant="display" align="center" numberOfLines={1}>
        {titulo}
      </Text>
      <Adorno forma="corto" />
      <Text color="textMuted" align="center">
        {subtitulo}
      </Text>

      {/* En la esquina, para no romper la simetría del centro */}
      {accion && (
        <View style={styles.accion}>
          <BotonRedondo accion={accion} variante="borde" />
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Aire arriba: el botón de la esquina no se encima con el título
    encabezado: { alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.sm },
    accion: { position: 'absolute', top: theme.spacing.none, right: theme.spacing.none },
  });
