import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, InputField, ScreenContainer, Text } from '@/shared/ui/atoms';
import { nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { IngredienteConCosto } from '../components/IngredienteConCosto';
import { useHacerReceta } from '../hooks/useHacerReceta';
import { textoCantidadReceta, textoCosto, textoVeces } from '../textos';

/**
 * Realizar la receta: el dueño escribe cuántas unidades tiene que hacer y ve cuánto necesita de cada ingrediente.
 * 24 chipás de una receta de 12 son la receta ×2: 1 kilo de harina pasa a 2 kilos
 */
export function HacerRecetaScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const hacer = useHacerReceta(id);
  const refresco = useRefrescar(hacer.refrescar);
  const { receta } = hacer;

  if (!receta) {
    return (
      <ScreenContainer width="form" edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
        <View style={styles.contenido}>
          {hacer.cargando && !refresco.refrescando ? (
            <Cargando mensaje="Cargando la receta…" llenarAlto style={styles.cargando} />
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={hacer.errorReceta ?? 'Este producto todavía no tiene receta'} />
              {hacer.errorReceta && <Button variant="secondary" label="Reintentar" onPress={hacer.reintentarReceta} />}
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer width="form" edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
      <View style={styles.contenido}>
        <View style={styles.bloque}>
          <Text variant="title">{nombreParaMostrar(receta.producto.nombre)}</Text>
          <Text color="textMuted">Cada receta rinde {textoCantidadReceta(receta.rinde, 'unidad')}</Text>
        </View>

        <InputField
          label="¿Cuántas unidades tenés que hacer?"
          value={hacer.texto}
          onChangeText={hacer.setTexto}
          placeholder={String(receta.rinde)}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={6}
          error={hacer.errorUnidades ?? undefined}
          helper="Escribí cuántas te pidieron y te digo cuánto necesitás de cada cosa."
        />

        {hacer.para !== null && (
          <View style={styles.seccion}>
            <Text variant="subtitle">Para {textoCantidadReceta(hacer.para, 'unidad')}</Text>
            <Text color="primary" style={styles.cifra}>
              {textoVeces(hacer.veces)}
            </Text>
            {hacer.hayRedondeos && (
              <Text variant="caption" color="textMuted">
                No da justo con la receta: lo que no daba entero está redondeado para arriba, así no te falta.
              </Text>
            )}
            <View>
              {hacer.ingredientes.map((ingrediente) => (
                <IngredienteConCosto
                  key={ingrediente.insumo ?? ingrediente.nombre}
                  ingrediente={ingrediente}
                  redondeado={ingrediente.redondeado}
                />
              ))}
            </View>
            {hacer.costoTotal !== null && (
              <Text variant="bodyStrong" style={styles.cifra}>
                En ingredientes: {textoCosto(hacer.costoTotal)}
              </Text>
            )}
            {hacer.calculando && !refresco.refrescando && <Cargando tamano="chico" mensaje="Calculando…" />}
          </View>
        )}

        {hacer.errorCalculo && (
          <View style={styles.bloque}>
            <Alert tone="danger" message={hacer.errorCalculo} />
            <Button variant="secondary" label="Reintentar" onPress={hacer.reintentarCalculo} />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    seccion: { gap: theme.spacing.xs },
    cifra: { fontVariant: ['tabular-nums'] },
  });
