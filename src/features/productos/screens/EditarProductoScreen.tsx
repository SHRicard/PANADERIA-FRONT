import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { CamposProducto } from '../components/CamposProducto';
import { SelectorFotos } from '../components/SelectorFotos';
import { useEditarProducto } from '../hooks/useEditarProducto';

// Formulario: no lleva el gesto de refrescar. El título lo pone el header del Stack
export function EditarProductoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { producto, cargando, categorias, control, enfocar, enviar, enviando, error, fotos } = useEditarProducto(id);

  if (!producto) {
    return (
      <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
        {cargando ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
        ) : (
          <Text color="textMuted">Este producto ya no existe.</Text>
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        {error && <Alert tone="danger" message={error} />}

        <SelectorFotos
          fotos={fotos.delSelector}
          procesando={fotos.procesando}
          aviso={fotos.aviso}
          lleno={fotos.lleno}
          ayuda="Tocá la estrella de una foto para elegirla de portada. Los cambios en las fotos se aplican en el momento, sin tocar Guardar."
          onGaleria={fotos.elegirDeGaleria}
          onCamara={fotos.sacarFoto}
          onQuitar={fotos.quitar}
          onPortada={fotos.hacerPortada}
          onTocar={fotos.tocar}
        />

        <CamposProducto control={control} enfocar={enfocar} categorias={categorias} />

        <Button label="Guardar cambios" onPress={enviar} loading={enviando} fullWidth />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
  });
