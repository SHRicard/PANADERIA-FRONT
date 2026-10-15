import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useStyles, type Theme } from '@/theme';

export interface ScreenContainerProps {
  children: ReactNode;
  /** Ancho máximo en pantallas anchas: `form` para formularios, `content` para listados */
  width?: 'form' | 'content';
  /** Centra el contenido en vertical (formularios cortos, como el login) */
  centered?: boolean;
  /** El `control` de `useRefrescar`, en pantallas con datos de la API */
  refreshControl?: ScrollViewProps['refreshControl'];
  edges?: Edge[];
}

const BORDES_POR_DEFECTO: Edge[] = ['top', 'bottom', 'left', 'right'];

export function ScreenContainer({
  children,
  width = 'content',
  centered = false,
  refreshControl,
  edges = BORDES_POR_DEFECTO,
}: ScreenContainerProps) {
  const styles = useStyles(createStyles);

  return (
    <SafeAreaView edges={edges} style={styles.fondo}>
      {/* También en Android: con edge-to-edge (SDK 54+) el adjustResize ya no achica la ventana y el teclado tapaba los inputs */}
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, width === 'form' && styles.scrollForm, centered && styles.centrado]}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          <View style={[styles.contenido, width === 'form' ? styles.anchoForm : styles.anchoContenido]}>
            {children}
          </View>
        </ScrollView>
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
  });
