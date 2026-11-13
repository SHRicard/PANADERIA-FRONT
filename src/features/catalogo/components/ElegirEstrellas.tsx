import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Icon, Text, useFlechasRadio } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { TEXTO_PUNTAJE } from '../textos';
import { Ilustracion } from './navidad/Ilustracion';

interface ElegirEstrellasProps {
  /** De 1 a 5; 0 = todavía no eligió */
  valor: number;
  alCambiar: (puntaje: number) => void;
  error?: string;
  /** De Navidad: galletitas de jengibre en lugar de estrellas */
  navidad?: boolean;
}

const ESTRELLAS = [1, 2, 3, 4, 5];

/**
 * Las cinco estrellas para votar, grandes para el dedo. Al lado, lo que dice ese puntaje («¡Es mi ganador!»).
 * Con el mouse, pasar por encima ya muestra cuántas quedarían. De Navidad, galletitas de jengibre: apagadas las que no
 * eligió, a todo color (y apenas más grandes) las que sí
 */
export function ElegirEstrellas({ valor, alCambiar, error, navidad = false }: ElegirEstrellasProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const unidad = (n: number) => (navidad ? (n === 1 ? 'galletita' : 'galletitas') : n === 1 ? 'estrella' : 'estrellas');
  const [encima, setEncima] = useState(0);
  const mostrado = encima || valor;
  // Con el teclado (en la web): Tab entra a la elegida y las flechas suben o bajan el puntaje
  const flechas = useFlechasRadio(ESTRELLAS, valor || null, alCambiar);

  return (
    <View style={styles.campo}>
      <View style={styles.fila}>
        <View style={styles.estrellas} role="radiogroup" aria-label={navidad ? 'Cuántas galletitas le das' : 'Cuántas estrellas le das'}
          {...flechas.grupo}
        >
          {ESTRELLAS.map((estrella, indice) => {
            const prendida = estrella <= mostrado;
            return (
              <Pressable
                key={estrella}
                {...flechas.opcion(indice)}
                onPress={() => alCambiar(estrella)}
                onHoverIn={() => setEncima(estrella)}
                onHoverOut={() => setEncima(0)}
                accessibilityRole="radio"
                accessibilityLabel={`${estrella} ${unidad(estrella)}: ${TEXTO_PUNTAJE[estrella]}`}
                // aria-checked y no accessibilityState: en la web, react-native-web solo lee el primero
                aria-checked={estrella === valor}
                style={({ pressed }) => [styles.estrella, pressed && styles.presionada]}
              >
                {navidad ? (
                  <Ilustracion
                    nombre="galletaEstrella"
                    alto={theme.sizes.galletaPuntaje}
                    style={prendida ? styles.galletaPrendida : styles.galletaApagada}
                  />
                ) : (
                  <Icon icon={Star} size="xl" color={prendida ? 'accent' : 'border'} relleno={prendida && 'lleno'} />
                )}
              </Pressable>
            );
          })}
        </View>
        <Text variant="subtitle" color={mostrado ? 'primary' : 'textMuted'} style={styles.texto}>
          {mostrado ? TEXTO_PUNTAJE[mostrado] : navidad ? 'Tocá una galletita' : 'Tocá una estrella'}
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
    galletaApagada: { opacity: theme.opacity.galletaApagada },
    galletaPrendida: { transform: [{ scale: 1.12 }] },
    texto: { flexShrink: 1 },
  });
