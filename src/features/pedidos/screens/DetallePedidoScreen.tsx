import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Ban,
  BellRing,
  Car,
  CircleCheck,
  Eye,
  EyeOff,
  MessageCircle,
  PackageCheck,
  Pencil,
  Store,
  Undo2,
} from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Badge, Button, CampoTexto, Cargando, Icon, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { useDetallePedido } from '../hooks/useDetallePedido';
import { estadoDe, fechaYHora, MARCA_MANUAL, MARCA_NUEVO, marcaEnvio } from '../textos';

export function DetallePedidoScreen() {
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useDetallePedido(id);
  const refresco = useRefrescar(detalle.refrescar);
  const { pedido, enCurso } = detalle;
  const ocupado = enCurso !== null;

  if (!pedido) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
        <View style={styles.contenido}>
          {detalle.cargando && !refresco.refrescando ? (
            <Cargando mensaje="Cargando el pedido…" llenarAlto style={styles.cargando} />
          ) : detalle.noExiste ? (
            <View style={styles.bloque}>
              <Text variant="subtitle">Este pedido no existe</Text>
              <Button variant="secondary" icon={ArrowLeft} label="Volver a pedidos" onPress={detalle.volver} />
            </View>
          ) : (
            <View style={styles.bloque}>
              <Alert tone="danger" message={detalle.errorCarga ?? 'No se pudo cargar el pedido'} />
              <Button variant="secondary" label="Reintentar" onPress={detalle.reintentar} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  const estado = estadoDe(pedido);
  const envio = marcaEnvio(pedido.conEnvio);
  const abierto = pedido.estado === 'pendiente' || pedido.estado === 'confirmado';
  const pedirMonto = pedido.estado === 'pendiente' || detalle.corrigiendoSena;
  /** Con seña de verdad (mayor que 0). ❌ No uses `pedido.sena?.monto &&` en el JSX: con 0, React Native intenta dibujar el 0 */
  const conSena = (pedido.sena?.monto ?? 0) > 0;
  /** Lo confirmó sin seña (`sena.monto` 0) */
  const sinSena = pedido.sena?.monto === 0;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control} llenarAlto>
      <View style={styles.contenido}>
        {/* Sin ver: arriba de todo, el aviso y el botón. Al marcarlo, la pantalla queda como la de cualquier pedido */}
        {!pedido.visto && (
          <View style={styles.nuevo}>
            <Alert tone="info" title="Pedido nuevo" message="Todavía no lo marcaste como visto: sale resaltado en la lista y en el inicio." />
            <Button
              icon={Eye}
              label="Marcar como visto"
              onPress={detalle.marcarVisto}
              loading={enCurso === 'visto'}
              disabled={ocupado}
              fullWidth
            />
          </View>
        )}

        <View style={styles.bloque}>
          <View style={styles.marcas}>
            {!pedido.visto && <Badge tone="primary" label={MARCA_NUEVO} />}
            <Badge tone={estado.tone} label={estado.label} />
            <Badge tone={envio.tone} label={envio.label} />
          </View>
          <Text variant="title">{pedido.clienteNombre}</Text>
          <Text color="textMuted">
            Pedido del {fechaYHora(pedido.createdAt)}
            {pedido.origen === 'manual' ? ` · ${MARCA_MANUAL.toLowerCase()}` : ''}
          </Text>
          {pedido.cliente && (
            <Text variant="caption" color="textMuted">
              {pedido.cliente.cantidadPedidos === 1 ? 'Es su primer pedido' : `Hizo ${pedido.cliente.cantidadPedidos} pedidos`}
            </Text>
          )}
          <Button
            variant="success"
            size="sm"
            icon={MessageCircle}
            label="Escribirle por WhatsApp"
            onPress={detalle.escribirAlCliente}
          />
        </View>

        {/* Lo eligió el cliente al pedir (o el dueño, en el pedido manual): acá solo se lee. Una línea a todo el
            ancho: el autito si hay que mandarlo, el local si lo pasa a retirar */}
        <View style={[styles.envio, pedido.conEnvio ? styles.envioSi : styles.envioNo]} accessible>
          <Icon icon={pedido.conEnvio ? Car : Store} color={pedido.conEnvio ? 'warning' : 'primary'} />
          <Text variant="bodyStrong" numberOfLines={1} style={styles.envioTexto}>
            {pedido.conEnvio ? 'El cliente solicitó envío' : 'El cliente lo retira en el local'}
          </Text>
        </View>

        <View style={styles.seccion}>
          <View style={styles.encabezadoSeccion}>
            <Text variant="label">Productos</Text>
            {/* El cliente pidió sumar, sacar o cambiar algo: solo mientras está abierto */}
            {abierto && (
              <Button variant="ghost" size="sm" icon={Pencil} label="Editar productos" onPress={detalle.editarProductos} disabled={ocupado} />
            )}
          </View>
          {pedido.items.map((item) => (
            <View key={item.producto} style={styles.fila}>
              <Text style={styles.nombre}>
                {item.cantidad} × {nombreParaMostrar(item.nombre)}
              </Text>
              <Text style={styles.cifra}>{formatearPrecio(item.precio * item.cantidad)}</Text>
            </View>
          ))}
          <View style={[styles.fila, styles.total]}>
            <Text variant="subtitle">Total</Text>
            <Text variant="subtitle" style={styles.cifra}>
              {formatearPrecio(pedido.total)}
            </Text>
          </View>
          {/* Sin seña no salen: falta cobrar todo el total, que ya está arriba */}
          {conSena && pedido.sena && (
            <>
              <View style={styles.fila}>
                <Text color="textMuted">Seña</Text>
                <Text color="textMuted" style={styles.cifra}>
                  − {formatearPrecio(pedido.sena.monto)}
                </Text>
              </View>
              <View style={styles.fila}>
                <Text variant="label">{pedido.estado === 'entregado' ? 'Cobrado al entregar' : 'Falta cobrar'}</Text>
                <Text variant="label" style={styles.cifra}>
                  {formatearPrecio(pedido.saldo)}
                </Text>
              </View>
            </>
          )}
        </View>

        {pedido.nota ? (
          <View style={styles.seccion}>
            <Text variant="label">Nota del cliente</Text>
            <Text>{pedido.nota}</Text>
          </View>
        ) : null}

        {detalle.error && <Alert tone="danger" message={detalle.error} />}

        {/* Seña: confirmarla (pendiente) o corregirla / quitarla (confirmado) */}
        {abierto && (
          <View style={styles.seccion}>
            <Text variant="label">Seña</Text>
            {pedido.sena && !detalle.corrigiendoSena && (
              <>
                <Text color="textMuted">
                  {sinSena
                    ? `Sin seña, confirmado el ${fechaYHora(pedido.sena.pagadaEn)}`
                    : `${formatearPrecio(pedido.sena.monto)}, confirmada el ${fechaYHora(pedido.sena.pagadaEn)}`}
                </Text>
                <View style={styles.botonesFila}>
                  <Button
                    variant="ghost"
                    size="sm"
                    label={sinSena ? 'Cargar seña' : 'Corregir monto'}
                    onPress={detalle.corregirSena}
                    disabled={ocupado}
                  />
                  {/* Sin seña, «Deshacer» es el mismo DELETE …/sena: vuelve a «Esperando la seña» */}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Undo2}
                    label={sinSena ? 'Deshacer' : 'Quitar seña'}
                    onPress={detalle.quitarSena}
                    loading={enCurso === 'quitarSena'}
                    disabled={ocupado}
                  />
                </View>
              </>
            )}
            {pedirMonto && (
              <>
                <CampoTexto
                  control={detalle.form.control}
                  name="monto"
                  label="¿Cuánto te transfirió?"
                  placeholder={String(Math.round(pedido.total / 2))}
                  helper={`En pesos, sin puntos. Hasta ${formatearPrecio(pedido.total)}.`}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={() => void detalle.confirmarSena()}
                />
                <Button
                  icon={CircleCheck}
                  label={detalle.corrigiendoSena ? 'Guardar monto' : 'Confirmar seña'}
                  onPress={() => void detalle.confirmarSena()}
                  loading={enCurso === 'sena'}
                  disabled={ocupado}
                  fullWidth
                />
                {/* El mismo PUT …/sena con 0. También al corregir: así se arreglan los que se cargaron con $1 */}
                {!sinSena && (
                  <Button
                    variant="secondary"
                    label="Sin seña"
                    onPress={detalle.confirmarSinSena}
                    loading={enCurso === 'sinSena'}
                    disabled={ocupado}
                    fullWidth
                  />
                )}
                {detalle.corrigiendoSena && (
                  <Button variant="ghost" label="No cambiar" onPress={detalle.dejarDeCorregir} disabled={ocupado} fullWidth />
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.acciones}>
          {abierto && (
            <>
              <Button variant="success" icon={BellRing} label="Avisar que está listo" onPress={detalle.avisarListo} fullWidth />
              <Button
                variant={pedido.estado === 'confirmado' ? 'primary' : 'secondary'}
                icon={PackageCheck}
                label="Marcar entregado"
                onPress={detalle.entregar}
                loading={enCurso === 'entrega'}
                disabled={ocupado}
                fullWidth
              />
              <Button
                variant="danger"
                icon={Ban}
                label="Cancelar pedido"
                onPress={detalle.cancelar}
                loading={enCurso === 'cancelar'}
                disabled={ocupado}
                fullWidth
              />
            </>
          )}
          {pedido.estado === 'entregado' && pedido.entregadoEn && (
            <>
              <Text color="textMuted" align="center">
                Entregado el {fechaYHora(pedido.entregadoEn)}
              </Text>
              <Button
                variant="ghost"
                icon={Undo2}
                label="Deshacer entrega"
                onPress={detalle.deshacerEntrega}
                loading={enCurso === 'quitarEntrega'}
                disabled={ocupado}
                fullWidth
              />
            </>
          )}
          {pedido.estado === 'cancelado' && (
            <>
              {pedido.canceladoEn && (
                <Text color="textMuted" align="center">
                  Cancelado el {fechaYHora(pedido.canceladoEn)}
                  {conSena && pedido.sena ? `. Tenía una seña de ${formatearPrecio(pedido.sena.monto)}.` : ''}
                </Text>
              )}
              <Button
                variant="ghost"
                icon={Undo2}
                label="Deshacer cancelación"
                onPress={detalle.deshacerCancelacion}
                loading={enCurso === 'quitarCancelacion'}
                disabled={ocupado}
                fullWidth
              />
            </>
          )}
          {/* Por si lo marcó sin querer: chico, al final */}
          {pedido.visto && pedido.origen === 'web' && (
            <Button
              variant="ghost"
              size="sm"
              icon={EyeOff}
              label="Marcar como no visto"
              onPress={detalle.marcarNoVisto}
              loading={enCurso === 'quitarVisto'}
              disabled={ocupado}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { flexGrow: 1, gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    nuevo: { gap: theme.spacing.sm },
    marcas: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
    seccion: { gap: theme.spacing.sm },
    // Una sola línea a todo el ancho, con el fondo suave del tono de la marca (sin borde)
    envio: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    envioSi: { backgroundColor: theme.colors.warningSoft },
    envioNo: { backgroundColor: theme.colors.primarySoft },
    envioTexto: { flex: 1 },
    encabezadoSeccion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
    nombre: { flex: 1 },
    cifra: { fontVariant: ['tabular-nums'] },
    total: { paddingTop: theme.spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    botonesFila: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    acciones: { gap: theme.spacing.sm },
  });
