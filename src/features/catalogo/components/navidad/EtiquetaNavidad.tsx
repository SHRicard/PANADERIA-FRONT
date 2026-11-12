import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { Ilustracion } from './Ilustracion';

interface EtiquetaNavidadProps {
  /** El texto que eligió el dueño («El más elegido»). Sale en mayúsculas */
  texto: string;
}

/**
 * La etiqueta de un producto en los catálogos de Navidad (en lugar del `Sello` dorado de todo el año): roja como una
 * cinta de regalo, con el texto blanco, una costura punteada adentro y una ramita de acebo prendida a la izquierda,
 * montada sobre el borde
 */
export function EtiquetaNavidad({ texto }: EtiquetaNavidadProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.lugar}>
      <View style={styles.cinta}>
        <View style={styles.costura}>
          {/* Hasta dos renglones: en una tarjeta angosta entra entero */}
          <Text variant="overline" color="onPrimary" numberOfLines={2} style={styles.texto}>
            {texto}
          </Text>
        </View>
      </View>
      <Ilustracion nombre="acebo" alto={theme.sizes.aceboEtiqueta} style={styles.acebo} />
    </View>
  );
}

const createStyles = (theme: Theme) => {
  const acebo = theme.sizes.aceboEtiqueta;
  return StyleSheet.create({
    // Lugar a la izquierda para la mitad del acebo que sobresale
    lugar: { position: 'relative', alignSelf: 'flex-start', maxWidth: '100%', paddingLeft: acebo / 2 },
    cinta: {
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.cinta,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
    },
    // La costura, con lugar a la izquierda para la otra mitad del acebo
    costura: {
      paddingLeft: acebo / 2 + theme.spacing.xxs,
      paddingRight: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.sm - theme.spacing.xxs,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.nieve,
    },
    texto: { flexShrink: 1 },
    // Prendido sobre el borde izquierdo, a la mitad de alto, apenas torcido
    acebo: {
      position: 'absolute',
      left: 0,
      top: '50%',
      marginTop: -acebo / 2,
      transform: [{ rotate: '-12deg' }],
    },
  });
};
