import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LogoDamaBlanca from '@/shared/assets/logo-dama-blanca.svg';
import { useBreakpoint } from '@/shared/hooks';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { saludoSegunHora } from '../textos';

interface CabeceraBienvenidaProps {
  /** Cuántos productos activos hay y en cuántos gustos. null mientras cargan */
  resumen: { productos: number; gustos: number } | null;
  /** Los filtros (el buscador y el gusto): van al final de la bienvenida */
  children: ReactNode;
}

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * Arriba de la carta: una barra con la marca y cuántos productos hay, y abajo la bienvenida (el saludo según
 * la hora, «¿Qué se te antoja hoy?», dos líneas y los filtros). Alineada a la izquierda, como una página web
 */
export function CabeceraBienvenida({ resumen, children }: CabeceraBienvenidaProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';

  return (
    <View>
      <View style={styles.barra}>
        <LogoDamaBlanca width={theme.sizes.logoChico} height={theme.sizes.logoChico} aria-hidden />
        <View style={styles.marca}>
          <Text variant="title">Dama Blanca</Text>
          <Text variant="overline" color="textMuted">
            Horneados
          </Text>
        </View>
        {resumen && (
          <Text variant="caption" color="textMuted" align="right">
            {`${cantidad(resumen.productos)} · ${resumen.gustos} ${resumen.gustos === 1 ? 'gusto' : 'gustos'}`}
          </Text>
        )}
      </View>

      <View style={[styles.bienvenida, enCompu && styles.bienvenidaCompu]}>
        <Text variant="overline" color="primary">
          {saludoSegunHora(new Date().getHours())}
        </Text>
        <Text variant={enCompu ? 'hero' : 'display'} accessibilityRole="header">
          ¿Qué se te antoja hoy?
        </Text>
        <Text color="textMuted" style={styles.bajada}>
          Elegí lo que gustes: acá está todo lo que horneamos, agrupado por gusto y con su precio. Tocá un producto
          para ver sus fotos.
        </Text>
        <View style={styles.filtros}>{children}</View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    barra: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    marca: { flex: 1 },
    bienvenida: { gap: theme.spacing.sm, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl },
    bienvenidaCompu: { paddingTop: theme.spacing.xxxl, paddingBottom: theme.spacing.xxl },
    // Un renglón cómodo de leer: no cruza todo el ancho
    bajada: { maxWidth: theme.sizes.buscadorMax },
    filtros: { paddingTop: theme.spacing.sm },
  });
