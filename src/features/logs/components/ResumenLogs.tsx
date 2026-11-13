import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { NIVELES_LOG } from '../schemas';
import { formatearNumero, NIVEL, nombreApartado, rutaConMetodo, textoDesde, textoIps, textoPeticiones } from '../textos';
import type { ResumenLogs as Resumen } from '../types';

/** Cuántos apartados se ven de entrada: el resto, con «Ver los N» */
const APARTADOS_VISIBLES = 5;

interface ResumenLogsProps {
  resumen: Resumen;
}

/** La cabecera de Logs: cuántas peticiones, cómo les fue, cuántos visitantes y sospechosas, y lo más pedido */
export function ResumenLogs({ resumen }: ResumenLogsProps) {
  const styles = useStyles(createStyles);
  const [todos, setTodos] = useState(false);
  const apartados = todos ? resumen.apartados : resumen.apartados.slice(0, APARTADOS_VISIBLES);
  const desde = textoDesde(resumen.desde);

  return (
    <View style={styles.caja}>
      {desde && (
        <Text variant="caption" color="textMuted">
          {desde}
        </Text>
      )}

      <View style={styles.numeros}>
        <Numero valor={resumen.total} label="Peticiones" />
        <Numero valor={resumen.visitantes} label="Visitantes" ayuda="IP distintas" />
        <Numero valor={resumen.sospechosos} label="Sospechosas" alerta={resumen.sospechosos > 0} />
      </View>

      <View style={styles.niveles}>
        {NIVELES_LOG.map((nivel) => (
          <View key={nivel} style={styles.nivel}>
            <Icon icon={NIVEL[nivel].icono} size="xs" color={NIVEL[nivel].color} />
            <Text variant="caption">
              {formatearNumero(resumen.porNivel[nivel])} {NIVEL[nivel].plural}
            </Text>
          </View>
        ))}
      </View>

      {apartados.length > 0 && (
        <View style={styles.apartados}>
          <Text variant="label">Lo más pedido</Text>
          {apartados.map((a) => {
            const nombre = nombreApartado(a.apartado);
            return (
              <View key={`${a.metodo} ${a.apartado}`} style={styles.apartado}>
                <View style={styles.textos}>
                  {nombre && <Text variant="bodyStrong">{nombre}</Text>}
                  <Text variant="caption" color="textMuted" numberOfLines={1}>
                    {rutaConMetodo(a.metodo, a.apartado)}
                  </Text>
                </View>
                <Text variant="caption" color="textMuted" align="right">
                  {textoPeticiones(a.peticiones)}
                  {'\n'}
                  {textoIps(a.ips)}
                </Text>
              </View>
            );
          })}
          {resumen.apartados.length > APARTADOS_VISIBLES && (
            <Button
              variant="ghost"
              size="sm"
              label={todos ? 'Ver menos' : `Ver los ${resumen.apartados.length}`}
              onPress={() => setTodos((t) => !t)}
            />
          )}
        </View>
      )}
    </View>
  );
}

interface NumeroProps {
  valor: number;
  label: string;
  ayuda?: string;
  /** En rojo: hay algo que mirar */
  alerta?: boolean;
}

function Numero({ valor, label, ayuda, alerta = false }: NumeroProps) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.numero} accessible accessibilityLabel={`${label}: ${valor}${ayuda ? `. ${ayuda}` : ''}`}>
      <Text variant="title" color={alerta ? 'danger' : 'text'}>
        {formatearNumero(valor)}
      </Text>
      <Text variant="caption" color={alerta ? 'danger' : 'textMuted'}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    caja: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    numeros: { flexDirection: 'row', gap: theme.spacing.sm },
    numero: { flex: 1, gap: theme.spacing.xxs },
    niveles: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    nivel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    apartados: { gap: theme.spacing.sm, paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    apartado: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
