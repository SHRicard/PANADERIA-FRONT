import { StyleSheet, View } from 'react-native';
import { Alert, Button, CalendarioMes, CampoTexto, Cargando, HojaInferior, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { AgendaDelInicio } from '../hooks/useAgenda';
import { LeyendaAgenda } from './LeyendaAgenda';

interface AgendaPedidosProps {
  /** El hook vive en el inicio, que la refresca al tirar para abajo junto con lo demás */
  agenda: AgendaDelInicio;
  /** Mientras el inicio refresca, sin otro spinner */
  refrescando: boolean;
}

/**
 * La agenda, en el inicio: el tope de productos por día, el mes pintado como lo ve el cliente (verde «Libre», amarillo
 * «Casi», rojo «Llena») y la leyenda. Tocar un día abre su pantalla (/agenda/[fecha]) con sus números, «Qué hay que
 * hacer», «Agenda llena» y sus pedidos: antes iba todo acá abajo y el inicio quedaba muy cargado
 */
export function AgendaPedidos({ agenda, refrescando }: AgendaPedidosProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.agenda}>
      <View style={styles.encabezado}>
        <Text variant="subtitle">Agenda</Text>
        <View style={styles.referencia}>
          <Text variant="caption" color="textMuted" style={styles.referenciaTexto}>
            {agenda.productosPorDia
              ? `Tu tope: ${agenda.productosPorDia} productos por día`
              : 'Poné cuántos productos podés preparar por día: al llegar, la web deja de ofrecer ese día'}
          </Text>
          <Button variant="ghost" size="sm" label={agenda.productosPorDia ? 'Cambiar' : 'Ponerlo'} onPress={agenda.editarReferencia} />
        </View>
      </View>

      {agenda.errorCarga && (
        <View style={styles.error}>
          <Alert tone="danger" message={agenda.errorCarga} />
          <Button variant="secondary" size="sm" label="Reintentar" onPress={agenda.reintentar} />
        </View>
      )}

      <CalendarioMes
        mes={agenda.mes}
        dias={agenda.dias}
        alElegir={agenda.abrirDia}
        alMesAnterior={agenda.alMesAnterior}
        alMesSiguiente={agenda.alMesSiguiente}
      />
      {agenda.cargando && !refrescando && <Cargando tamano="chico" mensaje="Cargando la agenda" />}
      {agenda.productosPorDia !== null && <LeyendaAgenda productosPorDia={agenda.productosPorDia} />}

      {agenda.error && <Alert tone="danger" message={agenda.error} />}
      <Text variant="caption" color="textMuted">
        Tocá un día para ver sus pedidos y qué hay que hacer.
      </Text>

      {/* La referencia */}
      <HojaInferior
        visible={agenda.editandoReferencia}
        alCerrar={agenda.dejarDeEditarReferencia}
        titulo="Productos por día"
        pie={<Button label="Guardar" onPress={agenda.guardarReferencia} loading={agenda.guardandoReferencia} fullWidth />}
      >
        <CampoTexto
          control={agenda.form.control}
          name="productosPorDia"
          label="¿Cuántos productos podés preparar por día?"
          placeholder="25"
          helper="Tu tope: cuando un día llega a este número, la web deja de ofrecerlo. Desde el 40 % sale «Casi». Vacío, no cierra ninguno solo."
          keyboardType="number-pad"
        />
      </HojaInferior>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    agenda: { gap: theme.spacing.lg },
    encabezado: { gap: theme.spacing.xs },
    referencia: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    referenciaTexto: { flex: 1 },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  });
