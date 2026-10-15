import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Camera, CircleAlert, ImagePlus, Star, X, type LucideIcon } from 'lucide-react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { FOTOS_MAX } from '../schemas';

/** Una casilla del selector: una foto elegida, una ya guardada o una que se está subiendo */
export interface FotoDelSelector {
  clave: string;
  uri: string;
  /** Solo las fotos de la cola: `subiendo` (o esperando turno) o `error`. Sin estado, ya está */
  estado?: 'subiendo' | 'error';
  /** Si muestra la X para quitarla */
  quitable: boolean;
  /** Si muestra la estrella para elegirla de portada. Una que se está subiendo todavía no puede serlo */
  elegiblePortada: boolean;
  /** Mientras se aplica un cambio sobre ella (ej.: pasarla a portada): muestra la rueda */
  ocupada?: boolean;
}

interface SelectorFotosProps {
  fotos: FotoDelSelector[];
  /** Mientras se achican las fotos recién elegidas */
  procesando: boolean;
  aviso: string | null;
  lleno: boolean;
  /** Ayuda de abajo cuando no hay aviso */
  ayuda: string;
  onGaleria: () => void;
  onCamara: () => void;
  onQuitar: (clave: string) => void;
  /** La estrella: la elige de portada */
  onPortada: (clave: string) => void;
  /** Tocar la foto: la hace portada, o vuelve a intentar una que no se subió */
  onTocar?: (clave: string) => void;
}

/** El campo de fotos del producto: muestra las que hay y deja sumar de la galería o de la cámara */
export function SelectorFotos({
  fotos,
  procesando,
  aviso,
  lleno,
  ayuda,
  onGaleria,
  onCamara,
  onQuitar,
  onPortada,
  onTocar,
}: SelectorFotosProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  const casillaAgregar = (icono: LucideIcon, label: string, accessibilityLabel: string, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.casilla, styles.agregar, pressed && styles.presionada]}
    >
      <Icon icon={icono} color="primary" />
      <Text variant="caption" color="primary">
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.campo}>
      <View style={styles.encabezado}>
        <Text variant="label">Fotos</Text>
        <Text variant="caption" color="textMuted">
          {fotos.length} de {FOTOS_MAX}
        </Text>
      </View>

      <View style={styles.grilla}>
        {fotos.map(({ clave, uri, estado, quitable, elegiblePortada, ocupada }, indice) => {
          const esPortada = indice === 0;
          const descripcion = [
            `Foto ${indice + 1}`,
            esPortada && 'portada',
            estado === 'subiendo' && 'subiendo',
            estado === 'error' && 'no se subió',
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <View key={clave} style={styles.casilla}>
              <Pressable
                onPress={() => onTocar?.(clave)}
                disabled={!onTocar}
                accessibilityRole="button"
                accessibilityLabel={descripcion}
                style={styles.relleno}
              >
                <Image
                  source={{ uri }}
                  style={[styles.relleno, (estado || ocupada) && styles.atenuada]}
                  contentFit="cover"
                />
              </Pressable>

              {(estado || ocupada) && (
                <View style={styles.centro} pointerEvents="none">
                  {estado !== 'error' ? (
                    <ActivityIndicator color={theme.colors.primary} />
                  ) : (
                    <View style={styles.marcaError}>
                      <Icon icon={CircleAlert} size="lg" color="danger" />
                    </View>
                  )}
                </View>
              )}

              {esPortada ? (
                <View style={[styles.estrella, styles.portada]} pointerEvents="none">
                  <Icon icon={Star} size="sm" color="onPrimary" />
                  <Text variant="caption" color="onPrimary">
                    Portada
                  </Text>
                </View>
              ) : (
                elegiblePortada &&
                !ocupada && (
                  <Pressable
                    onPress={() => onPortada(clave)}
                    hitSlop={theme.spacing.sm}
                    accessibilityRole="button"
                    accessibilityLabel={`Usar la foto ${indice + 1} de portada`}
                    style={({ pressed }) => [styles.estrella, pressed && styles.presionada]}
                  >
                    <Icon icon={Star} size="sm" color="textMuted" />
                  </Pressable>
                )
              )}

              {quitable && (
                <Pressable
                  onPress={() => onQuitar(clave)}
                  hitSlop={theme.spacing.sm}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar la foto ${indice + 1}`}
                  style={styles.quitar}
                >
                  <Icon icon={X} size="sm" />
                </Pressable>
              )}
            </View>
          );
        })}

        {procesando && (
          <View style={[styles.casilla, styles.agregar]} accessibilityLabel="Preparando las fotos">
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        )}

        {!lleno && !procesando && (
          <>
            {casillaAgregar(ImagePlus, 'Galería', 'Elegir fotos de la galería', onGaleria)}
            {casillaAgregar(Camera, 'Cámara', 'Sacar una foto', onCamara)}
          </>
        )}
      </View>

      {aviso ? (
        <Text variant="caption" color="danger" accessibilityLiveRegion="polite">
          {aviso}
        </Text>
      ) : (
        <Text variant="caption" color="textMuted">
          {ayuda}
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    campo: { gap: theme.spacing.sm },
    encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    casilla: {
      width: theme.sizes.foto,
      height: theme.sizes.foto,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    relleno: { flex: 1 },
    atenuada: { opacity: theme.opacity.disabled },
    centro: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
    marcaError: { padding: theme.spacing.xxs, borderRadius: theme.radius.full, backgroundColor: theme.colors.surface },
    // Abajo a la izquierda: la estrella para elegirla, o la marca "Portada" en la que ya lo es
    estrella: {
      position: 'absolute',
      left: theme.spacing.xs,
      bottom: theme.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xxs,
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    portada: { paddingRight: theme.spacing.xs, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
    quitar: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      padding: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    agregar: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    presionada: { opacity: theme.opacity.pressed },
  });
