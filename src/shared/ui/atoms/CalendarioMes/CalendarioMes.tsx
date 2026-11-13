import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { nombreDelMes, semanasDelMes } from '@/shared/utils';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

const DIAS_DE_LA_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** El color del aviso de un día con tono */
const COLOR_DEL_TONO: Record<NonNullable<DiaCalendario['tono']>, ColorToken> = {
  exito: 'success',
  atencion: 'warning',
  peligro: 'danger',
};

/** Cómo se ve un día. Los que no vienen en `dias` se ven normales y se pueden elegir */
export interface DiaCalendario {
  /** No se puede tocar: fuera del rango o con la agenda llena */
  deshabilitado?: boolean;
  /** Texto chico debajo del número (por ejemplo «Llena») */
  aviso?: string;
  /** Un punto de color debajo del número (la agenda del dueño) */
  punto?: ColorToken;
  /**
   * El día va en rojo y se puede tocar, pero no se elige: el calendario le pasa este mensaje a `alRechazar` (por
   * ejemplo, un día con la agenda llena, para explicarle al cliente por qué no lo puede elegir)
   */
  rechazo?: string;
  /** Lo que lee el lector de pantalla en vez de `aviso`, si el aviso va abreviado («Llena» → «Agenda llena») */
  avisoAccesible?: string;
  /**
   * El color del día y de su aviso: `exito` en verde (un día libre), `atencion` en amarillo (uno que se está llenando),
   * `peligro` en rojo (uno lleno que igual se puede elegir, como en la agenda del dueño). Sin tono, el aviso va en rojo
   */
  tono?: 'exito' | 'atencion' | 'peligro';
  /** Un número en un circulito en la esquina (por ejemplo, cuántos productos hay ese día). Sin él, o con 0, no va */
  contador?: number;
  /** Qué cuenta, para el lector de pantalla: «productos» → «3 productos» */
  queCuenta?: string;
  /** Un ícono chico en la esquina de arriba a la izquierda (un día con algo distinto, como uno reducido en la agenda) */
  icono?: LucideIcon;
  /** El día de hoy, destacado: en blanco (`surface`), con el borde grueso del color de la letra y el aviso en ese color */
  hoy?: boolean;
}

/** Más de esto no entra en el circulito: «99+» */
const CONTADOR_MAX = 99;

export interface CalendarioMesProps {
  /** AAAA-MM */
  mes: string;
  /** El día elegido (AAAA-MM-DD), resaltado */
  seleccionado?: string | null;
  dias?: Record<string, DiaCalendario>;
  alElegir: (dia: string) => void;
  /** Al tocar un día con `rechazo`: recibe el mensaje para mostrarlo */
  alRechazar?: (mensaje: string, dia: string) => void;
  /** Sin ellas, la flecha no se muestra (por ejemplo, el cliente no puede ir a un mes sin días para elegir) */
  alMesAnterior?: () => void;
  alMesSiguiente?: () => void;
}

/** Un mes, de lunes a domingo, para elegir un día. No sabe de pedidos: qué día se puede tocar lo dice `dias` */
export function CalendarioMes({
  mes,
  seleccionado,
  dias = {},
  alElegir,
  alRechazar,
  alMesAnterior,
  alMesSiguiente,
}: CalendarioMesProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  // Todas las casillas dejan abajo el mismo lugar para el punto y el aviso, lo tengan o no: si no, la fila de un día
  // «Llena» sale más alta que las otras
  const marcas = Object.values(dias);
  const hayPunto = marcas.some((marca) => marca.punto);
  const hayAviso = marcas.some((marca) => marca.aviso);
  const altoPie =
    (hayPunto ? theme.spacing.sm : 0) +
    (hayAviso ? Number(theme.text.caption.lineHeight) : 0) +
    (hayPunto && hayAviso ? theme.spacing.xxs : 0);

  return (
    <View style={styles.calendario}>
      <View style={styles.encabezado}>
        <Flecha icono={ChevronLeft} etiqueta="Mes anterior" alTocar={alMesAnterior} />
        <Text variant="subtitle" style={styles.mes}>
          {conMayuscula(nombreDelMes(mes))}
        </Text>
        <Flecha icono={ChevronRight} etiqueta="Mes siguiente" alTocar={alMesSiguiente} />
      </View>

      <View style={styles.semana}>
        {DIAS_DE_LA_SEMANA.map((letra, i) => (
          <Text key={i} variant="caption" color="textMuted" align="center" style={styles.celda}>
            {letra}
          </Text>
        ))}
      </View>

      {semanasDelMes(mes).map((semana, i) => (
        <View key={i} style={styles.semana}>
          {semana.map((dia, j) => {
            if (!dia) return <View key={j} style={styles.celda} />;
            const { deshabilitado = false, aviso, punto, rechazo, avisoAccesible, tono, contador = 0, queCuenta, hoy = false, icono } = dias[dia] ?? {};
            const elegido = dia === seleccionado;
            const numero = Number(dia.slice(8));
            const leido = avisoAccesible ?? aviso;
            return (
              <Pressable
                key={dia}
                onPress={() => (rechazo ? alRechazar?.(rechazo, dia) : alElegir(dia))}
                disabled={deshabilitado && !rechazo}
                accessibilityRole="button"
                accessibilityState={{ disabled: deshabilitado || !!rechazo }}
                // aria-selected y no accessibilityState: react-native-web no lo pasa al HTML. El elegido también se dice
                // en el texto (un botón con aria-selected no siempre se anuncia)
                aria-selected={elegido}
                accessibilityLabel={`${numero}${leido ? `, ${leido}` : ''}${contador > 0 ? `, ${contador}${queCuenta ? ` ${queCuenta}` : ''}` : ''}${elegido ? ', elegido' : ''}`}
                accessibilityHint={rechazo}
                style={({ pressed }) => [
                  styles.celda,
                  styles.dia,
                  deshabilitado ? styles.deshabilitado : styles.habilitado,
                  rechazo && styles.rechazado,
                  tono && styles[tono],
                  hoy && styles.hoy,
                  elegido && styles.elegido,
                  pressed && styles.presionado,
                ]}
              >
                <Text
                  variant="bodyStrong"
                  color={elegido ? 'background' : rechazo ? 'danger' : deshabilitado ? 'textMuted' : 'text'}
                >
                  {numero}
                </Text>
                {altoPie > 0 && (
                  <View style={[styles.pie, { height: altoPie }]}>
                    {punto && <View style={[styles.punto, { backgroundColor: theme.colors[punto] }]} />}
                    {aviso && (
                      <Text
                        variant="caption"
                        color={elegido ? 'background' : hoy ? 'text' : tono ? COLOR_DEL_TONO[tono] : 'danger'}
                        style={hoy && !elegido ? styles.avisoHoy : undefined}
                        numberOfLines={1}
                      >
                        {aviso}
                      </Text>
                    )}
                  </View>
                )}
                {icono && (
                  <View style={styles.icono} aria-hidden>
                    <Icon icon={icono} size="xs" color={elegido ? 'background' : 'primary'} />
                  </View>
                )}
                {contador > 0 && (
                  <View style={[styles.contador, elegido && styles.contadorElegido]}>
                    <Text variant="caption" color={elegido ? 'text' : 'onPrimary'} style={styles.contadorTexto}>
                      {contador > CONTADOR_MAX ? `${CONTADOR_MAX}+` : contador}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** "noviembre de 2026" → "Noviembre de 2026" (con `capitalize` saldría «Noviembre De 2026») */
const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

function Flecha({ icono, etiqueta, alTocar }: { icono: typeof ChevronLeft; etiqueta: string; alTocar?: () => void }) {
  const styles = useStyles(createStyles);
  if (!alTocar) return <View style={styles.flecha} />;
  return (
    <Pressable onPress={alTocar} accessibilityRole="button" accessibilityLabel={etiqueta} style={styles.flecha} hitSlop={8}>
      <Icon icon={icono} color="primary" />
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    calendario: { gap: theme.spacing.xs },
    encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    mes: { flex: 1, textAlign: 'center' },
    flecha: { width: theme.sizes.touchMin, height: theme.sizes.touchMin, alignItems: 'center', justifyContent: 'center' },
    semana: { flexDirection: 'row', gap: theme.spacing.xs },
    celda: { flex: 1 },
    dia: {
      minHeight: theme.sizes.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xxs,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.md,
    },
    // Los que se pueden elegir tienen borde, como un botón; los que no, solo el número apagado
    habilitado: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
    deshabilitado: { borderWidth: 1, borderColor: 'transparent' },
    rechazado: { borderColor: theme.colors.danger, backgroundColor: theme.colors.dangerSoft },
    exito: { borderColor: theme.colors.success, backgroundColor: theme.colors.successSoft },
    atencion: { borderColor: theme.colors.warning, backgroundColor: theme.colors.warningSoft },
    peligro: { borderColor: theme.colors.danger, backgroundColor: theme.colors.dangerSoft },
    // El elegido, en el color de la letra (oscuro en claro, claro en oscuro) y con un aro afuera: no se confunde con
    // ningún día de color (en Navidad el `primary` es rojo, como «Llena»)
    elegido: {
      borderColor: theme.colors.text,
      backgroundColor: theme.colors.text,
      outlineWidth: theme.spacing.xxs,
      outlineOffset: theme.spacing.xxs,
      outlineStyle: 'solid',
      outlineColor: theme.colors.text,
    },
    // Hoy: en blanco, con el borde grueso en el color de la letra; se distingue de los días de color de un vistazo
    hoy: { borderWidth: theme.spacing.xxs, borderColor: theme.colors.text, backgroundColor: theme.colors.surface },
    avisoHoy: { fontFamily: theme.fonts.textoNegrita },
    presionado: { opacity: theme.opacity.pressed },
    pie: { alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xxs },
    punto: { width: theme.spacing.sm, height: theme.spacing.sm, borderRadius: theme.radius.full },
    // El circulito del contador, colgado de la esquina de arriba a la derecha (sale un poco de la casilla, hacia el
    // espacio entre días, para no tapar el número)
    // Redondo del todo: el mismo ancho que alto, con lugar para «99+»
    contador: {
      position: 'absolute',
      top: -theme.spacing.sm,
      right: -theme.spacing.sm,
      zIndex: 1,
      width: Number(theme.text.caption.lineHeight) + theme.spacing.sm,
      height: Number(theme.text.caption.lineHeight) + theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      borderWidth: theme.spacing.xxs,
      borderColor: theme.colors.surface,
      backgroundColor: theme.colors.primary,
    },
    // El ícono de la esquina de arriba a la izquierda: adentro de la casilla (el circulito va del otro lado)
    icono: { position: 'absolute', top: theme.spacing.xs, left: theme.spacing.xs },
    contadorElegido: { borderColor: theme.colors.text, backgroundColor: theme.colors.background },
    contadorTexto: { fontFamily: theme.fonts.textoNegrita },
  });
