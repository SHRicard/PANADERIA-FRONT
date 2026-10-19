import { StyleSheet, View } from 'react-native';
import { Alert, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import {
  fechaDelCalculo,
  formatearBytes,
  formatearCreditos,
  formatearPorcentaje,
  textoCreditos,
  TEXTOS_NIVEL,
} from '../textos';
import type { UsoCloudinary } from '../types';

interface ResumenUsoProps {
  uso: UsoCloudinary;
}

/**
 * Cuánto del plan de Cloudinary está usado: el aviso según el nivel, los créditos con la barra y de dónde salen
 * (lo guardado ahora, y lo entregado y las transformaciones de los últimos 30 días)
 */
export function ResumenUso({ uso }: ResumenUsoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const aviso = TEXTOS_NIVEL[uso.nivel];
  const rubros = [
    {
      nombre: 'Guardado',
      detalle: `${uso.archivos} fotos y videos, ahora`,
      valor: formatearBytes(uso.almacenamiento.bytes),
      creditos: uso.almacenamiento.creditos,
    },
    {
      nombre: 'Entregado',
      detalle: 'Lo que se vio en la web y en la app, últimos 30 días',
      valor: formatearBytes(uso.anchoDeBanda.bytes),
      creditos: uso.anchoDeBanda.creditos,
    },
    {
      nombre: 'Transformaciones',
      detalle: 'Miniaturas, marca de agua y formatos, últimos 30 días',
      valor: String(uso.transformaciones.cantidad),
      creditos: uso.transformaciones.creditos,
    },
  ];

  return (
    <View style={styles.resumen}>
      <Alert tone={aviso.tono} title={aviso.titulo} message={aviso.detalle} />

      <View style={styles.tarjeta}>
        <View style={styles.encabezado}>
          <Text variant="subtitle" style={styles.creditos}>
            {formatearCreditos(uso.creditos.usados)} de {uso.creditos.limite} créditos
          </Text>
          <Text variant="bodyStrong" color={aviso.color}>
            {formatearPorcentaje(uso.creditos.porcentaje)}
          </Text>
        </View>
        <View
          style={styles.barra}
          accessibilityRole="progressbar"
          accessibilityLabel="Créditos usados del plan"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(uso.creditos.porcentaje) }}
        >
          <View
            style={[
              styles.relleno,
              { width: `${Math.min(uso.creditos.porcentaje, 100)}%`, backgroundColor: theme.colors[aviso.color] },
            ]}
          />
        </View>
        <Text variant="caption" color="textMuted">
          Te quedan {textoCreditos(uso.creditos.restantes)} del plan {uso.plan}
        </Text>

        <View style={styles.rubros}>
          {rubros.map((rubro) => (
            <View key={rubro.nombre} style={styles.rubro}>
              <View style={styles.textos}>
                <Text>{rubro.nombre}</Text>
                <Text variant="caption" color="textMuted">
                  {rubro.detalle}
                </Text>
              </View>
              <View style={styles.valores}>
                <Text variant="bodyStrong">{rubro.valor}</Text>
                <Text variant="caption" color="textMuted">
                  {textoCreditos(rubro.creditos)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text variant="caption" color="textMuted">
        Un crédito es 1 GB guardado, 1 GB entregado o 1000 transformaciones.
        {uso.actualizadoAl
          ? ` Datos de Cloudinary del ${fechaDelCalculo(uso.actualizadoAl)}: lo que borres se descuenta cuando vuelva a calcular.`
          : ' Lo que borres se descuenta cuando Cloudinary vuelva a calcular.'}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    resumen: { gap: theme.spacing.md },
    tarjeta: {
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    encabezado: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
    creditos: { flex: 1 },
    barra: {
      height: theme.spacing.sm,
      borderRadius: theme.radius.full,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    relleno: { height: '100%', borderRadius: theme.radius.full },
    rubros: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    rubro: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
    valores: { alignItems: 'flex-end', gap: theme.spacing.xxs },
  });
