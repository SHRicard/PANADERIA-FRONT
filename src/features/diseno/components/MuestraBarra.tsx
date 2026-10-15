import { useState, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { PESTANAS_ADMIN, type BarraProps, type Pestana } from '@/features/navegacion';
import { useStyles, type Theme } from '@/theme';

interface MuestraBarraProps {
  Barra: ComponentType<BarraProps>;
}

// Una barra de pestañas de verdad, sin navegador: tocar una pestaña solo cambia cuál está activa
export function MuestraBarra({ Barra }: MuestraBarraProps) {
  const styles = useStyles(createStyles);
  const [activa, setActiva] = useState(0);

  const pestanas: Pestana[] = PESTANAS_ADMIN.map(({ ruta, titulo, icono }, indice) => ({
    clave: ruta,
    titulo,
    icono,
    activa: indice === activa,
    alPresionar: () => setActiva(indice),
  }));

  return (
    <View style={styles.marco}>
      <Barra pestanas={pestanas} margenInferior={0} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Simula el pie de la pantalla: fondo de la app arriba y la barra apoyada abajo
    marco: {
      paddingTop: theme.spacing.xl,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
  });
