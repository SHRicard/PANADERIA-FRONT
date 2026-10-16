import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { TEXTO_PUNTAJE } from '../textos';

interface ElegirEstrellasProps {
  /** De 1 a 5; 0 = todavía no eligió */
  valor: number;
  alCambiar: (puntaje: number) => void;
  error?: string;
}

const ESTRELLAS = [1, 2, 3, 4, 5];

/**
 * Las cinco estrellas para votar, grandes para el dedo. Al lado, lo que dice ese puntaje («¡Es mi ganador!»).
 * Con el mouse, pasar por encima ya muestra cuántas quedarían
 */
export function ElegirEstrellas({ valor, alCambiar, error }: ElegirEstrellasProps) {
  const styles = useStyles(createStyles);
  const [encima, setEncima] = useState(0);
  const mostrado = encima || valor;

  return (
    <View style={styles.campo}>
      <View style={styles.fila}>
        <View style={styles.estrellas} role="radiogroup" aria-label="Cuántas estrellas le das">
          {ESTRELLAS.map((estrella) => {
            const prendida = estrella <= mostrado;
            return (
              <Pressable
                key={estrella}
                onPress={() => alCambiar(estrella)}
                onHoverIn={() => setEncima(estrella)}
                onHoverOut={() => setEncima(0)}
                accessibilityRole="radio"
                accessibilityLabel={`${estrella} ${estrella === 1 ? 'estrella' : 'estrellas'}: ${TEXTO_PUNTAJE[estrella]}`}
                accessibilityState={{ checked: estrella === valor }}
                style={({ pressed }) => [styles.estrella, pressed && styles.presionada]}
              >
                <Icon icon={Star} size="xl" color={prendida ? 'accent' : 'border'} relleno={prendida && 'lleno'} />
              </Pressable>
            );
          })}
        </View>
        <Text variant="subtitle" color={mostrado ? 'primary' : 'textMuted'} style={styles.texto}>
          {mostrado ? TEXTO_PUNTAJE[mostrado] : 'Tocá una estrella'}
        </Text>
      </View>
      {error && (
        <Text variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.xs },
    fila: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: theme.spacing.md },
    estrellas: { flexDirection: 'row' },
    estrella: {
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
    },
    presionada: { opacity: theme.opacity.pressed },
    texto: { flexShrink: 1 },
  });
