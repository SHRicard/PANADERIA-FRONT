import { StyleSheet, View } from 'react-native';
import { ArrowRight, Check, Globe, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Alert, Button, HojaInferior, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type ColorToken, type Theme } from '@/theme';
import { gananciaPorUnidad } from '../precio';
import { textoCambioPrecio, textoCosto, textoMultiplicador } from '../textos';
import type { ConfirmacionPrecio } from '../types';

export interface ConfirmarPrecioProps {
  visible: boolean;
  /** La última que se armó: se queda mientras la hoja se va, así no se vacía */
  confirmacion: ConfirmacionPrecio | null;
  guardando: boolean;
  error: string | null;
  alConfirmar: () => void;
  alCancelar: () => void;
}

/** Una línea de la cuenta: qué es a la izquierda y el monto a la derecha */
function Fila({ etiqueta, valor, color = 'text' }: { etiqueta: string; valor: string; color?: ColorToken }) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.fila}>
      <Text color="textMuted" style={styles.etiqueta}>
        {etiqueta}
      </Text>
      <Text variant="bodyStrong" color={color} style={styles.cifra}>
        {valor}
      </Text>
    </View>
  );
}

/**
 * La hoja que confirma el precio nuevo antes de guardarlo: el de hoy tachado contra el nuevo, cuánto baja o sube,
 * de dónde sale (lo que cuesta × el multiplicador, redondeado) y cuánto gana por unidad
 */
export function ConfirmarPrecio({ visible, confirmacion, guardando, error, alConfirmar, alCancelar }: ConfirmarPrecioProps) {
  const styles = useStyles(createStyles);
  if (!confirmacion) return null;

  const { actual, nuevo, exacto, costo, multiplicador, redondeo } = confirmacion;
  // Bajar el precio es lo que más conviene mirar dos veces: va en ámbar. Subirlo, en verde
  const baja = nuevo < actual;
  const tono: ColorToken = baja ? 'warning' : 'success';
  const ganancia = gananciaPorUnidad(nuevo, costo);

  return (
    <HojaInferior
      visible={visible}
      alCerrar={alCancelar}
      titulo="¿Cambiar el precio?"
      pie={
        <View style={styles.botones}>
          <Button icon={Check} label={`Cambiar a ${formatearPrecio(nuevo)}`} onPress={alConfirmar} loading={guardando} fullWidth />
          <Button variant="ghost" label="Cancelar" onPress={alCancelar} disabled={guardando} fullWidth />
        </View>
      }
    >
      <View style={styles.tarjeta}>
        <View
          style={styles.precios}
          accessible
          accessibilityLabel={`Hoy ${formatearPrecio(actual)}, pasa a ${formatearPrecio(nuevo)}`}
        >
          <View style={styles.columna}>
            <Text variant="overline" color="textMuted">
              Hoy
            </Text>
            <Text variant="subtitle" color="textMuted" style={[styles.cifra, styles.tachado]}>
              {formatearPrecio(actual)}
            </Text>
          </View>
          <Icon icon={ArrowRight} color="accent" />
          <View style={[styles.columna, styles.derecha]}>
            <Text variant="overline" color="primary">
              Nuevo
            </Text>
            <Text variant="heading" color="primary" style={styles.cifra}>
              {formatearPrecio(nuevo)}
            </Text>
          </View>
        </View>
        <View style={[styles.cambio, baja ? styles.cambioBaja : styles.cambioSube]}>
          <Icon icon={baja ? TrendingDown : TrendingUp} size="sm" color={tono} />
          <Text variant="label" color={tono} style={styles.cifra}>
            {textoCambioPrecio(actual, nuevo)}
          </Text>
        </View>
      </View>

      <View>
        <Fila etiqueta="Cada unidad te cuesta" valor={textoCosto(costo)} />
        <Fila etiqueta={`Multiplicado ${textoMultiplicador(multiplicador)}`} valor={formatearPrecio(exacto)} />
        {redondeo !== null && <Fila etiqueta="Redondeado para arriba" valor={formatearPrecio(nuevo)} />}
        <Fila etiqueta="Ganás por unidad" valor={textoCosto(ganancia)} color={ganancia > 0 ? 'success' : 'danger'} />
      </View>

      <View style={styles.nota}>
        <Icon icon={Globe} size="sm" color="textMuted" />
        <Text variant="caption" color="textMuted" style={styles.notaTexto}>
          Los clientes lo ven así en la web apenas lo cambiás.
        </Text>
      </View>

      {error && <Alert tone="danger" message={error} />}
    </HojaInferior>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tarjeta: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    precios: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    columna: { flexShrink: 1, gap: theme.spacing.xxs },
    derecha: { alignItems: 'flex-end' },
    tachado: { textDecorationLine: 'line-through' },
    cifra: { fontVariant: ['tabular-nums'] },
    cambio: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    cambioBaja: { backgroundColor: theme.colors.warningSoft },
    cambioSube: { backgroundColor: theme.colors.successSoft },
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    etiqueta: { flex: 1 },
    nota: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    notaTexto: { flex: 1 },
    botones: { gap: theme.spacing.xs },
  });
