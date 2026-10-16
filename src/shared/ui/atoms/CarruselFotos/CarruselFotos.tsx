import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight, Croissant } from 'lucide-react-native';
import { useStyles, useTheme, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface FotoCarrusel {
  id: string;
  /** La foto grande */
  url: string;
  /** La chica: se ve mientras carga la grande */
  miniatura?: string;
}

export interface CarruselFotosProps {
  fotos: readonly FotoCarrusel[];
  /** Qué se ve, para el lector de pantalla: "Medialunas, foto 2 de 5" */
  nombre: string;
  /** Ancho / alto de cada foto. Por defecto 4/3 */
  proporcion?: number;
  /** Con más de una foto, abajo una tira con todas en chico para elegir cuál ver (en vez de los puntos) */
  miniaturas?: boolean;
}

// Desde este ancho de carrusel aparecen las flechas: en la compu no se puede deslizar con el dedo
const ANCHO_CON_FLECHAS = 420;

/**
 * Las fotos en grande, de a una, deslizando de costado. Con más de una: contador, flechas y, abajo, los puntos
 * o la tira de miniaturas
 */
export function CarruselFotos({ fotos, nombre, proporcion = 4 / 3, miniaturas = false }: CarruselFotosProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const scroll = useRef<ScrollView>(null);
  const tira = useRef<ScrollView>(null);
  const [ancho, setAncho] = useState(0);
  const [anchoTira, setAnchoTira] = useState(0);
  const [actual, setActual] = useState(0);

  const ir = (indice: number) => {
    const destino = Math.max(0, Math.min(fotos.length - 1, indice));
    // De a una, deslizando; más lejos, de golpe: deslizando pasaría por todas las del medio
    scroll.current?.scrollTo({ x: destino * ancho, animated: Math.abs(destino - actual) === 1 });
    setActual(destino);
  };

  // La miniatura de la foto que se ve queda a la vista, en el medio de la tira si se puede
  const paso = theme.sizes.miniatura + theme.spacing.sm;
  useEffect(() => {
    if (!miniaturas || anchoTira === 0) return;
    const sobra = fotos.length * paso - theme.spacing.sm - anchoTira;
    if (sobra <= 0) return;
    const x = actual * paso - (anchoTira - theme.sizes.miniatura) / 2;
    tira.current?.scrollTo({ x: Math.max(0, Math.min(sobra, x)), animated: true });
  }, [miniaturas, actual, anchoTira, fotos.length, paso, theme.sizes.miniatura, theme.spacing.sm]);

  if (fotos.length === 0) {
    return (
      <View style={[styles.marco, styles.vacio, { aspectRatio: proporcion }]} accessibilityLabel="Sin fotos">
        <Icon icon={Croissant} size="xl" color="textMuted" />
        <Text variant="caption" color="textMuted">
          Sin fotos todavía
        </Text>
      </View>
    );
  }

  const varias = fotos.length > 1;
  const conFlechas = varias && ancho >= ANCHO_CON_FLECHAS;

  return (
    <View style={styles.contenedor}>
      <View style={[styles.marco, { aspectRatio: proporcion }]} onLayout={({ nativeEvent }) => setAncho(nativeEvent.layout.width)}>
        {ancho > 0 && (
          <ScrollView
            ref={scroll}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            // onScroll y no onMomentumScrollEnd: la web no avisa cuándo termina el impulso
            onScroll={({ nativeEvent }) => setActual(Math.round(nativeEvent.contentOffset.x / ancho))}
            scrollEventThrottle={64}
          >
            {fotos.map((foto, indice) => (
              <Image
                key={foto.id}
                source={{ uri: foto.url }}
                placeholder={foto.miniatura ? { uri: foto.miniatura } : undefined}
                // Alto explícito y no aspectRatio: en la web, la foto adentro del scroll horizontal quedaba sin alto
                style={{ width: ancho, height: ancho / proporcion }}
                contentFit="cover"
                transition={200}
                accessibilityLabel={`${nombre}, foto ${indice + 1} de ${fotos.length}`}
              />
            ))}
          </ScrollView>
        )}
        {varias && (
          <View style={styles.contador} pointerEvents="none">
            <Text variant="caption">
              {actual + 1} / {fotos.length}
            </Text>
          </View>
        )}
        {conFlechas && actual > 0 && (
          <Pressable
            onPress={() => ir(actual - 1)}
            accessibilityRole="button"
            accessibilityLabel="Foto anterior"
            style={({ pressed }) => [styles.flecha, styles.izquierda, pressed && styles.presionada]}
          >
            <Icon icon={ChevronLeft} />
          </Pressable>
        )}
        {conFlechas && actual < fotos.length - 1 && (
          <Pressable
            onPress={() => ir(actual + 1)}
            accessibilityRole="button"
            accessibilityLabel="Foto siguiente"
            style={({ pressed }) => [styles.flecha, styles.derecha, pressed && styles.presionada]}
          >
            <Icon icon={ChevronRight} />
          </Pressable>
        )}
      </View>
      {varias && miniaturas && (
        <ScrollView
          ref={tira}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={({ nativeEvent }) => setAnchoTira(nativeEvent.layout.width)}
          contentContainerStyle={styles.tira}
        >
          {fotos.map((foto, indice) => (
            <Pressable
              key={foto.id}
              onPress={() => ir(indice)}
              accessibilityRole="button"
              accessibilityLabel={`Ver foto ${indice + 1} de ${fotos.length}`}
              accessibilityState={{ selected: indice === actual }}
              style={({ pressed }) => [
                styles.miniatura,
                indice === actual && styles.miniaturaActual,
                pressed && styles.presionada,
              ]}
            >
              <Image source={{ uri: foto.miniatura ?? foto.url }} style={styles.miniaturaFoto} contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
      )}
      {varias && !miniaturas && (
        <View style={styles.puntos} aria-hidden>
          {fotos.map((foto, indice) => (
            <View key={foto.id} style={[styles.punto, indice === actual && styles.puntoActual]} />
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenedor: { gap: theme.spacing.sm },
    marco: {
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    vacio: { alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
    contador: {
      position: 'absolute',
      right: theme.spacing.sm,
      bottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
    },
    flecha: {
      position: 'absolute',
      top: '50%',
      marginTop: -theme.sizes.touchMin / 2,
      width: theme.sizes.touchMin,
      height: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
    },
    izquierda: { left: theme.spacing.sm },
    derecha: { right: theme.spacing.sm },
    presionada: { opacity: theme.opacity.pressed },
    puntos: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs },
    punto: {
      width: theme.spacing.xs + theme.spacing.xxs,
      height: theme.spacing.xs + theme.spacing.xxs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
    },
    puntoActual: { width: theme.spacing.lg, backgroundColor: theme.colors.primary },
    tira: { gap: theme.spacing.sm },
    // La elegida, con un marco dorado separado de la foto; las otras, con el borde suave
    miniatura: {
      width: theme.sizes.miniatura,
      height: theme.sizes.miniatura,
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    miniaturaActual: { borderColor: theme.colors.primary },
    miniaturaFoto: { flex: 1, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surfaceMuted },
  });
