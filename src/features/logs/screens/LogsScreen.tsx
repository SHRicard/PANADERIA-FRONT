import { StyleSheet, View } from 'react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Button, Cargando, ScreenContainer, Segmentado, Select, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { AjustesLogs } from '../components/AjustesLogs';
import { HojaNombreIp } from '../components/HojaNombreIp';
import { ResumenLogs } from '../components/ResumenLogs';
import { TarjetaIp } from '../components/TarjetaIp';
import { TarjetaLog } from '../components/TarjetaLog';
import { TarjetaVisita } from '../components/TarjetaVisita';
import { useLogs } from '../hooks/useLogs';
import {
  FILTROS_PETICIONES,
  FILTROS_SOSPECHA,
  nombreConIp,
  textoIps,
  textoPeticiones,
  textoVisitas,
  VISTAS_LOGS,
} from '../textos';

// Más → Logs (docs/logs.md): quién usa la parte pública de la API, desde qué IP y cómo le fue, para enterarse de un
// ataque. Abre en las visitas. El título lo pone el header del Stack
export function LogsScreen() {
  const styles = useStyles(createStyles);
  const logs = useLogs();
  const { resumen, visitas, peticiones, ips } = logs;
  const refresco = useRefrescar(logs.refrescar);
  const cargandoLista = (cargando: boolean) => cargando && !refresco.refrescando;

  // Lo de cada vista que se repite: la carga, el error con «Reintentar» y cuántos hay
  const estadoLista = (lista: { cargando: boolean; error: string | null; reintentar: () => void }, mensaje: string, total: string) => (
    <>
      {cargandoLista(lista.cargando) && <Cargando mensaje={mensaje} style={styles.cargando} />}
      {lista.error && (
        <View style={styles.error}>
          <Alert tone="danger" message={lista.error} />
          <Button variant="secondary" label="Reintentar" onPress={lista.reintentar} />
        </View>
      )}
      {!lista.cargando && !lista.error && (
        <Text variant="caption" color="textMuted">
          {total}
        </Text>
      )}
    </>
  );

  // La IP elegida desde la vista IP: filtra las visitas y las peticiones
  const filtroIp = logs.ip && (
    <View style={styles.filtrando}>
      <Text variant="caption" style={styles.filtrandoTexto} numberOfLines={1}>
        Solo de {nombreConIp(logs.ip.ip, logs.ip.nombre)}
      </Text>
      <Button variant="ghost" size="sm" label="Limpiar" onPress={logs.limpiarIp} accessibilityLabel="Ver las de todas las IP" />
    </View>
  );

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} alLlegarAlFinal={logs.cargarMas}>
      <View style={styles.contenido}>
        <View style={styles.seccion}>
          <Text color="textMuted">
            Cada vez que alguien entra a la web queda anotado acá: desde qué IP, qué pidió y cómo le fue. Lo que hacés vos en
            la app no se guarda.
          </Text>
          <Alert tone="info" message="La IP es una pista, no una prueba: la de un celular cambia seguido y muchos comparten la misma." />
        </View>

        {cargandoLista(resumen.cargando) && <Cargando mensaje="Cargando el resumen…" style={styles.cargando} />}
        {resumen.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={resumen.error} />
            <Button variant="secondary" label="Reintentar" onPress={resumen.reintentar} />
          </View>
        )}
        {resumen.resumen && (
          <>
            <ResumenLogs resumen={resumen.resumen} />
            <AjustesLogs
              borradoAutomatico={resumen.borradoAutomatico}
              alCambiarBorrado={(opcion) => void resumen.cambiarBorradoAutomatico(opcion)}
              cambiandoBorrado={resumen.cambiandoBorrado}
              onBorrarTodo={resumen.pedirBorrarTodo}
              borrando={resumen.borrando}
              vacio={resumen.resumen.total === 0}
              error={resumen.errorAccion}
            />
          </>
        )}

        <View style={styles.seccion}>
          <Segmentado opciones={VISTAS_LOGS} valor={logs.vista} alCambiar={logs.setVista} accessibilityLabel="Qué ver" />

          {logs.vista === 'visitas' && (
            <>
              <Text variant="caption" color="textMuted">
                Una visita junta lo que hizo una IP hasta que pasan 30 minutos sin actividad.
              </Text>
              <Segmentado opciones={FILTROS_SOSPECHA} valor={visitas.filtro} alCambiar={visitas.setFiltro} accessibilityLabel="Qué visitas ver" />
              {filtroIp}
              {estadoLista(
                visitas,
                'Cargando las visitas…',
                visitas.total === 0 ? 'No hay visitas con este filtro' : textoVisitas(visitas.total)
              )}
              {visitas.visitas.map((visita) => (
                <TarjetaVisita key={`${visita.ip} ${visita.inicio}`} visita={visita} onAbrirPedido={logs.abrirPedido} />
              ))}
              {visitas.cargandoMas && <Cargando tamano="chico" mensaje="Cargando más visitas" />}
            </>
          )}

          {logs.vista === 'peticiones' && (
            <>
              <Select label="Mostrar" opciones={FILTROS_PETICIONES} valor={peticiones.filtro} alCambiar={peticiones.setFiltro} />
              {filtroIp}
              {estadoLista(
                peticiones,
                'Cargando las peticiones…',
                peticiones.total === 0 ? 'No hay peticiones con este filtro' : textoPeticiones(peticiones.total)
              )}
              {peticiones.logs.map((log) => (
                <TarjetaLog key={log.id} log={log} onAbrirPedido={logs.abrirPedido} />
              ))}
              {peticiones.cargandoMas && <Cargando tamano="chico" mensaje="Cargando más peticiones" />}
            </>
          )}

          {logs.vista === 'ips' && (
            <>
              <Segmentado opciones={FILTROS_SOSPECHA} valor={ips.filtro} alCambiar={ips.setFiltro} accessibilityLabel="Qué IP ver" />
              {ips.errorOlvidar && <Alert tone="danger" message={ips.errorOlvidar} />}
              {estadoLista(ips, 'Cargando las IP…', ips.total === 0 ? 'No hay IP con este filtro' : textoIps(ips.total))}
              {ips.ips.map((ip) => (
                <TarjetaIp
                  key={ip.ip}
                  ip={ip}
                  olvidando={ips.olvidando === ip.ip}
                  onVerVisitas={logs.verVisitasDe}
                  onNombrar={ips.nombre.editar}
                  onOlvidar={(i) => void ips.olvidar(i)}
                />
              ))}
              {ips.cargandoMas && <Cargando tamano="chico" mensaje="Cargando más IP" />}
            </>
          )}
        </View>
      </View>

      <HojaNombreIp
        ip={ips.nombre.ip}
        control={ips.nombre.form.control}
        alCerrar={ips.nombre.cerrar}
        alGuardar={() => void ips.nombre.guardar()}
        guardando={ips.nombre.guardando}
        error={ips.nombre.error}
      />
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    seccion: { gap: theme.spacing.md },
    cargando: { paddingVertical: theme.spacing.xxl },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    filtrando: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    filtrandoTexto: { flex: 1 },
  });
