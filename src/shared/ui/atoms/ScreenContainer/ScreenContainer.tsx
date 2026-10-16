import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useStyles, type Theme } from '@/theme';

export interface ScreenContainerProps {
  children: ReactNode;
  /**
   * Ancho máximo en pantallas anchas: `form` para formularios, `content` para listados y `completo` sin tope,
   * para cuando la pantalla arma su propio ancho (la carta del catálogo ocupa el 80% en la compu)
   */
  width?: 'form' | 'content' | 'completo';
  /** Centra el contenido en vertical (formularios cortos, como el login) */
  centered?: boolean;
  /** El `control` de `useRefrescar`, en pantallas con datos de la API */
  refreshControl?: ScrollViewProps['refreshControl'];
  /** Se llama cuando el scroll se acerca al final: para traer la página siguiente de una lista */
  alLlegarAlFinal?: () => void;
  /** Se llama al desplazar, con cuánto se bajó (en px) */
  alDesplazar?: (y: number) => void;
  /** El contenido ocupa todo el alto disponible: para mandar algo al fondo (ej.: Cerrar sesión en Más) */
  llenarAlto?: boolean;
  /** Algo fijo arriba, encima del scroll (ej.: la barra que aparece al bajar). Lo anima quien lo pasa */
  superpuesto?: ReactNode;
  /** Algo fijo abajo, debajo del scroll: no tapa el contenido (ej.: la barra del pedido en la web) */
  pie?: ReactNode;
  edges?: Edge[];
}

const BORDES_POR_DEFECTO: Edge[] = ['top', 'bottom', 'left', 'right'];

export function ScreenContainer({
  children,
  width = 'content',
  centered = false,
  refreshControl,
  alLlegarAlFinal,
  alDesplazar,
  llenarAlto = false,
  superpuesto,
  pie,
  edges = BORDES_POR_DEFECTO,
}: ScreenContainerProps) {
  const styles = useStyles(createStyles);

  const escuchaScroll = Boolean(alLlegarAlFinal || alDesplazar);
  const alScrollear: ScrollViewProps['onScroll'] = ({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => {
    alDesplazar?.(contentOffset.y);
    // Avisa cuando falta menos de media pantalla para el final: la página siguiente llega antes de que se note
    if (contentOffset.y + layoutMeasurement.height * 1.5 >= contentSize.height) alLlegarAlFinal?.();
  };

  return (
    <SafeAreaView edges={edges} style={styles.fondo}>
      {/* También en Android: con edge-to-edge (SDK 54+) el adjustResize ya no achica la ventana y el teclado tapaba los inputs */}
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, width === 'form' && styles.scrollForm, centered && styles.centrado]}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          onScroll={escuchaScroll ? alScrollear : undefined}
          // Más seguido si alguien sigue el scroll (la barra que aparece al bajar); para la página siguiente alcanza con menos
          scrollEventThrottle={alDesplazar ? 32 : alLlegarAlFinal && 200}
        >
          <View
            style={[
              styles.contenido,
              width === 'form' && styles.anchoForm,
              width === 'content' && styles.anchoContenido,
              llenarAlto && styles.llenar,
            ]}
          >
            {children}
          </View>
        </ScrollView>
        {pie}
        {/* Siempre montado mientras haya prop: así lo que entra y sale adentro puede animarse */}
        {superpuesto !== undefined && <View style={styles.superpuesto}>{superpuesto}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fondo: { flex: 1, backgroundColor: theme.colors.background },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xl },
    // El margen lateral del formulario lo da su ancho (90%): sin padding extra, para que sea 90% de la pantalla
    scrollForm: { paddingHorizontal: theme.spacing.none },
    centrado: { justifyContent: 'center' },
    contenido: { width: '100%', alignSelf: 'center' },
    anchoForm: { width: theme.sizes.formWidth, maxWidth: theme.sizes.formMax },
    anchoContenido: { maxWidth: theme.sizes.contentMax },
    llenar: { flexGrow: 1 },
    superpuesto: { position: 'absolute', top: theme.spacing.none, left: theme.spacing.none, right: theme.spacing.none, pointerEvents: 'box-none' },
  });
