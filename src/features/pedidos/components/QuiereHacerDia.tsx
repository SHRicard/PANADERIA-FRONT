import { StyleSheet, View } from 'react-native';
import { Alert, Button, CampoTexto, HojaInferior, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { ICONO_QUIERE_HACER } from '../agenda';
import type { DiaDeLaAgenda } from '../hooks/useDiaAgenda';

interface QuiereHacerDiaProps {
  quiereHacer: DiaDeLaAgenda['quiereHacer'];
  /** Su tope de siempre (null si no lo puso): la sugerencia y el «de 25» */
  productosPorDia: number | null;
}

/**
 * «¿Cuántos querés hacer este día?», en la pantalla de un día de la agenda: un día puntual con menos trabajo que su
 * tope de siempre. Lo que no quiere hacer, el back lo cuenta como ocupado, así que en la web el día puede pasar a «Casi»
 * o «Llena» (docs/quiere-hacer.md). Se pone en una hoja y se saca con «Volver a lo normal»
 */
export function QuiereHacerDia({ quiereHacer, productosPorDia }: QuiereHacerDiaProps) {
  const styles = useStyles(createStyles);
  const { valor } = quiereHacer;
  const deSiempre = productosPorDia ? ` (de ${productosPorDia})` : '';

  return (
    <View style={[styles.caja, valor !== null && styles.cajaReducida]}>
      <View style={styles.titulo}>
        <Icon icon={ICONO_QUIERE_HACER} size="sm" color={valor !== null ? 'primary' : 'textMuted'} />
        <Text variant="label">¿Cuántos querés hacer este día?</Text>
      </View>

      {valor === null ? (
        <Text variant="caption" color="textMuted">
          {productosPorDia ? `Los de siempre: hasta ${productosPorDia} productos.` : 'Sin tope: la web lo ofrece hasta que lo cierres.'}
        </Text>
      ) : (
        <>
          <Text variant="bodyStrong">
            Este día: hasta {valor}
            {deSiempre}
          </Text>
          <Text variant="caption" color="textMuted">
            Lo que no hacés cuenta como ocupado: la web lo muestra «Casi» o «Llena» antes.
          </Text>
        </>
      )}

      <View style={styles.botones}>
        <Button
          variant={valor === null ? 'secondary' : 'ghost'}
          size="sm"
          label={valor === null ? 'Hacer menos este día' : 'Cambiar'}
          onPress={quiereHacer.editar}
        />
        {valor !== null && (
          <Button
            variant="ghost"
            size="sm"
            label="Volver a lo normal"
            onPress={quiereHacer.volverALoNormal}
            loading={quiereHacer.quitando}
            accessibilityHint="El día vuelve a tu tope de siempre"
          />
        )}
      </View>

      <HojaInferior
        visible={quiereHacer.editando}
        alCerrar={quiereHacer.dejarDeEditar}
        titulo="Este día quiero hacer"
        pie={<Button label="Guardar" onPress={quiereHacer.guardar} loading={quiereHacer.guardando} fullWidth />}
      >
        <View style={styles.hoja}>
          <CampoTexto
            control={quiereHacer.form.control}
            name="quiereHacer"
            label="¿Cuántos productos querés hacer?"
            placeholder={productosPorDia ? String(productosPorDia) : '10'}
            helper={`Solo este día${deSiempre ? `, en vez de los ${productosPorDia} de siempre` : ''}. Lo que no hacés la web lo cuenta como ocupado.`}
            keyboardType="number-pad"
          />
          {quiereHacer.aviso && <Alert tone="warning" message={quiereHacer.aviso} />}
          {quiereHacer.error && <Alert tone="danger" message={quiereHacer.error} />}
        </View>
      </HojaInferior>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    caja: {
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    // Reducido: el borde en el color principal, para que se note que ese día no es como los demás
    cajaReducida: { borderColor: theme.colors.primary },
    titulo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    botones: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.xs },
    hoja: { gap: theme.spacing.md },
  });
