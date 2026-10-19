import { useState } from 'react';
import { StyleSheet, View, type AccessibilityActionEvent, type GestureResponderEvent } from 'react-native';
import { Text } from '@/shared/ui/atoms';
import { formatearPrecio } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { periodoCorto, periodoLargo } from '../textos';
import type { Agrupacion, PuntoBalance } from '../types';

interface GraficoBalanceProps {
  serie: PuntoBalance[];
  agrupar: Agrupacion;
}

/** "5 oct: entró $ 9.000, salió $ 0, quedó $ 9.000" */
const lectura = (punto: PuntoBalance, agrupar: Agrupacion) =>
  `${periodoLargo(punto.periodo, agrupar)}: entró ${formatearPrecio(punto.ingresos)}, salió ${formatearPrecio(punto.gastos)}, quedó ${formatearPrecio(punto.ganancia)}`;

/**
 * Lo que entró (arriba de la línea) y lo que salió (abajo) en cada período, con la misma escala para los dos.
 * Tocando o deslizando el dedo se elige un período y arriba se leen sus números; de entrada, el último
 */
export function GraficoBalance({ serie, agrupar }: GraficoBalanceProps) {
  const styles = useStyles(createStyles);
  const [elegido, setElegido] = useState<number | null>(null);
  const [ancho, setAncho] = useState(0);
  const ultimo = serie.length - 1;
  const indice = Math.min(elegido ?? ultimo, ultimo);
  const punto = serie[indice];
  // Una sola escala: la barra más alta, de las dos series, llega al borde
  const tope = Math.max(1, ...serie.map((p) => Math.max(p.ingresos, p.gastos)));
  const proporcion = (valor: number) => (valor > 0 ? `${Math.max((valor / tope) * 100, 2)}%` : '0%') as `${number}%`;

  const elegirEn = (evento: GestureResponderEvent) => {
    if (ancho <= 0) return;
    const x = evento.nativeEvent.locationX;
    setElegido(Math.min(ultimo, Math.max(0, Math.floor((x / ancho) * serie.length))));
  };

  // El lector de pantalla recorre los períodos deslizando arriba y abajo
  const alAccionar = ({ nativeEvent }: AccessibilityActionEvent) => {
    if (nativeEvent.actionName === 'increment') setElegido(Math.min(ultimo, indice + 1));
    if (nativeEvent.actionName === 'decrement') setElegido(Math.max(0, indice - 1));
  };

  if (!punto) return null;

  return (
    <View style={styles.caja}>
      <View style={styles.leyenda}>
        <Muestra serie="entro" label="Entró" />
        <Muestra serie="salio" label="Salió" />
      </View>

      <View style={styles.elegido}>
        <Text variant="label">{periodoLargo(punto.periodo, agrupar)}</Text>
        <Text variant="caption" color="textMuted">
          Entró {formatearPrecio(punto.ingresos)} · Salió {formatearPrecio(punto.gastos)} · Quedó {formatearPrecio(punto.ganancia)}
        </Text>
      </View>

      {/* box-only: el toque siempre cae en el gráfico, no en una barra, así locationX se mide desde su borde */}
      <View
        style={styles.grafico}
        pointerEvents="box-only"
        onLayout={(evento) => setAncho(evento.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onResponderGrant={elegirEn}
        onResponderMove={elegirEn}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Lo que entró y lo que salió en cada período"
        accessibilityValue={{ text: lectura(punto, agrupar) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={alAccionar}
      >
        {serie.map((p, i) => (
          <View key={p.periodo} style={[styles.columna, i === indice && styles.columnaElegida]}>
            <View style={styles.mitadArriba}>
              <View style={[styles.barra, styles.entro, { height: proporcion(p.ingresos) }]} />
            </View>
            <View style={styles.mitadAbajo}>
              <View style={[styles.barra, styles.salio, { height: proporcion(p.gastos) }]} />
            </View>
          </View>
        ))}
        <View style={styles.cero} />
      </View>

      <View style={styles.eje}>
        <Text variant="caption" color="textMuted">
          {periodoCorto(serie[0].periodo, agrupar)}
        </Text>
        {ultimo > 0 && (
          <Text variant="caption" color="textMuted">
            {periodoCorto(serie[ultimo].periodo, agrupar)}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Un cuadradito de la leyenda, con el color de su serie */
function Muestra({ serie, label }: { serie: 'entro' | 'salio'; label: string }) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.muestraItem}>
      <View style={[styles.muestra, styles[serie]]} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    caja: { gap: theme.spacing.md },
    leyenda: { flexDirection: 'row', gap: theme.spacing.lg },
    muestraItem: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    muestra: { width: theme.spacing.md, height: theme.spacing.md, borderRadius: theme.radius.sm },
    elegido: { gap: theme.spacing.xxs },
    // Las columnas se separan con un hueco del color de la superficie
    grafico: { flexDirection: 'row', gap: theme.spacing.xxs, height: theme.sizes.grafico },
    columna: { flex: 1, alignItems: 'center', borderRadius: theme.radius.sm },
    columnaElegida: { backgroundColor: theme.colors.surfaceMuted },
    mitadArriba: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
    mitadAbajo: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-start' },
    // Finas: con muchas columnas ocupan todo el ancho; con pocas, no pasan de este tope
    barra: { width: '70%', maxWidth: theme.spacing.xl },
    entro: {
      backgroundColor: theme.colors.grafico1,
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
    salio: {
      backgroundColor: theme.colors.grafico2,
      borderBottomLeftRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
    },
    // La línea del cero, entre lo que entró y lo que salió
    cero: {
      position: 'absolute',
      left: theme.spacing.none,
      right: theme.spacing.none,
      top: theme.sizes.grafico / 2,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    eje: { flexDirection: 'row', justifyContent: 'space-between' },
  });
