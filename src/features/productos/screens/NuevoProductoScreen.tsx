import { StyleSheet, View } from 'react-native';
import { Alert, Button, ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { CamposProducto } from '../components/CamposProducto';
import { SelectorFotos } from '../components/SelectorFotos';
import { useNuevoProducto } from '../hooks/useNuevoProducto';

// Formulario: no lleva el gesto de refrescar. El título lo pone el header del Stack
export function NuevoProductoScreen() {
  const styles = useStyles(createStyles);
  const { categorias, tipos, control, enfocar, enviar, enviando, error, fotos } = useNuevoProducto();

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']}>
      <View style={styles.contenido}>
        {error && <Alert tone="danger" message={error} />}

        <SelectorFotos
          fotos={fotos.delSelector}
          procesando={fotos.procesando}
          aviso={fotos.aviso}
          lleno={fotos.lleno}
          ayuda={
            fotos.fotos.length > 1
              ? 'Tocá la estrella de una foto para elegirla de portada.'
              : 'La portada es la que se ve en el catálogo. Las fotos se suben solas cuando guardás.'
          }
          onGaleria={fotos.elegirDeGaleria}
          onCamara={fotos.sacarFoto}
          onQuitar={fotos.quitar}
          onPortada={fotos.hacerPortada}
          onTocar={fotos.hacerPortada}
        />

        <CamposProducto control={control} enfocar={enfocar} categorias={categorias} tipos={tipos} />

        <View style={styles.acciones}>
          <Button label="Guardar producto" onPress={enviar} loading={enviando} disabled={fotos.procesando} fullWidth />
          <Text variant="caption" color="textMuted" align="center">
            Las fotos se suben en segundo plano: podés seguir usando la app.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    acciones: { gap: theme.spacing.sm },
  });
