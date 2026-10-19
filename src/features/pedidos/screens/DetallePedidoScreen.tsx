import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Ban, BellRing, CircleCheck, MessageCircle, PackageCheck, Undo2 } from 'lucide-react-native';
import { useRefrescar } from '@/shared/hooks';
import { Alert, Badge, Button, CampoTexto, ScreenContainer, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { useStyles, useTheme, type Theme } from '@/theme';
import { useDetallePedido } from '../hooks/useDetallePedido';
import { ESTADO, fechaYHora, MARCA_MANUAL } from '../textos';

export function DetallePedidoScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const detalle = useDetallePedido(id);
  const refresco = useRefrescar(detalle.refrescar);
  const { pedido, enCurso } = detalle;
  const ocupado = enCurso !== null;

  if (!pedido) {
    return (
      <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
        <View style={styles.contenido}>
          {detalle.cargando && !refresco.refrescando ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.cargando} />
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

  const estado = ESTADO[pedido.estado];
  const abierto = pedido.estado === 'pendiente' || pedido.estado === 'confirmado';
  const pedirMonto = pedido.estado === 'pendiente' || detalle.corrigiendoSena;

  return (
    <ScreenContainer edges={['bottom', 'left', 'right']} refreshControl={refresco.control}>
      <View style={styles.contenido}>
        <View style={styles.bloque}>
          <Badge tone={estado.tone} label={estado.label} />
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

        <View style={styles.seccion}>
          <Text variant="label">Productos</Text>
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
          {pedido.sena && (
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
                  {formatearPrecio(pedido.sena.monto)}, confirmada el {fechaYHora(pedido.sena.pagadaEn)}
                </Text>
                <View style={styles.botonesFila}>
                  <Button variant="ghost" size="sm" label="Corregir monto" onPress={detalle.corregirSena} disabled={ocupado} />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Undo2}
                    label="Quitar seña"
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
                  {pedido.sena ? `. Tenía una seña de ${formatearPrecio(pedido.sena.monto)}.` : ''}
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
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.xl },
    cargando: { paddingVertical: theme.spacing.xxl },
    bloque: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    seccion: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
    nombre: { flex: 1 },
    cifra: { fontVariant: ['tabular-nums'] },
    total: { paddingTop: theme.spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    botonesFila: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    acciones: { gap: theme.spacing.sm },
  });
