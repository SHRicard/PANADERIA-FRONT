import { StyleSheet, View } from 'react-native';
import { IlustracionNavidad, Vivo, type NombreAssetNavidad } from '@/features/catalogo';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

interface TituloPasoProps {
  /** El orden real del pedido: 1 revisar, 2 ver la seña, 3 dejar los datos y confirmar */
  numero: number;
  titulo: string;
  /** Algo chico a la derecha, como cuántos productos hay */
  detalle?: string;
  /** De Navidad: en lugar del círculo, un muñequito por paso que flota, con el número chico en la esquina */
  navidad?: boolean;
}

// El muñequito de cada paso (Navidad), por turno
const PERSONAJES: NombreAssetNavidad[] = ['osoGalleta', 'renoGorro', 'munecoNieveGalera'];

/**
 * El título de cada paso del pedido, con su número en un círculo dorado. De Navidad, el número va chico en la esquina
 * de un muñequito (el osito, el reno, el muñeco de nieve)
 */
export function TituloPaso({ numero, titulo, detalle, navidad = false }: TituloPasoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.titulo}>
      {navidad ? (
        <View style={styles.personaje} aria-hidden>
          <Vivo como="flotar" fase={numero * 0.4}>
            <IlustracionNavidad nombre={PERSONAJES[(numero - 1) % PERSONAJES.length]} alto={theme.sizes.mascota} />
          </Vivo>
          <View style={styles.insignia}>
            <Text variant="caption" style={styles.cifra}>
              {numero}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.numero} aria-hidden>
          <Text variant="label" color="primary" style={styles.cifra}>
            {numero}
          </Text>
        </View>
      )}
      <Text variant="title" accessibilityRole="header" style={styles.texto}>
        {titulo}
      </Text>
      {detalle ? (
        <Text variant="caption" color="textMuted">
          {detalle}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    titulo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    numero: {
      width: theme.sizes.insignia + theme.spacing.sm,
      height: theme.sizes.insignia + theme.spacing.sm,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.primarySoft,
    },
    // El muñequito, con lugar para que el número asome por la esquina de abajo a la derecha
    personaje: { position: 'relative', paddingRight: theme.spacing.xs },
    insignia: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      minWidth: theme.sizes.insignia,
      height: theme.sizes.insignia,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 1px ${theme.spacing.xxs}px ${theme.colors.shadow}`,
    },
    cifra: { fontFamily: theme.fonts.textoNegrita, fontVariant: ['tabular-nums'] },
    texto: { flex: 1 },
  });
