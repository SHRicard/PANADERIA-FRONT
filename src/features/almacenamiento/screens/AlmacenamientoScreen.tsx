import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, ScreenContainer, Segmentado, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import { FilaArchivo } from '../components/FilaArchivo';
import { ResumenUso } from '../components/ResumenUso';
import { useAlmacenamiento } from '../hooks/useAlmacenamiento';
import { useArchivos } from '../hooks/useArchivos';
import { claveArchivo, FILTROS_ARCHIVOS, textoTotalArchivos } from '../textos';

// Más → Memoria: cuánto del plan de Cloudinary está usado y lo que más ocupa, para borrar. El título lo pone el header del Stack
export function AlmacenamientoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const resumen = useAlmacenamiento();
  const lista = useArchivos();
  const refresco = useRefrescar(async () => {
    await Promise.all([resumen.refrescar(), lista.refrescar()]);
  });

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} alLlegarAlFinal={lista.cargarMas}>
      <View style={styles.contenido}>
        <Text color="textMuted">
          Tus fotos y videos están en Cloudinary, en el plan gratis. Si se pasa del límite, el catálogo se puede quedar sin fotos.
        </Text>

        {resumen.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}
        {resumen.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={resumen.error} />
            <Button variant="secondary" label="Reintentar" onPress={resumen.reintentar} />
          </View>
        )}
        {resumen.uso && <ResumenUso uso={resumen.uso} />}

        <View style={styles.seccion}>
          <Text variant="subtitle">Lo que más ocupa</Text>
          <Segmentado opciones={FILTROS_ARCHIVOS} valor={lista.filtro} alCambiar={lista.setFiltro} accessibilityLabel="Qué archivos ver" />

          {lista.cargando && !refresco.refrescando && <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />}
          {lista.error && (
            <View style={styles.error}>
              <Alert tone="danger" message={lista.error} />
              <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
            </View>
          )}
          {lista.errorBorrar && <Alert tone="danger" message={lista.errorBorrar} />}
          {!lista.cargando && !lista.error && (
            <Text variant="caption" color="textMuted">
              {textoTotalArchivos(lista.total, lista.totalBytes)}
            </Text>
          )}

          {lista.archivos.map((archivo) => (
            <FilaArchivo
              key={claveArchivo(archivo)}
              archivo={archivo}
              borrando={lista.borrando === claveArchivo(archivo)}
              bloqueado={lista.borrando !== null}
              onBorrar={() => lista.pedirBorrar(archivo)}
            />
          ))}
          {lista.cargandoMas && <ActivityIndicator color={theme.colors.primary} />}
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    seccion: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
