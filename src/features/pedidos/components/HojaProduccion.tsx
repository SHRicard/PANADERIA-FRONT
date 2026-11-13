import { StyleSheet, View } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { Alert, Button, Cargando, ControlCantidad, HojaInferior, Icon, Text } from '@/shared/ui/atoms';
import { nombreParaMostrar } from '@/shared/utils';
import { useStyles, type Theme } from '@/theme';
import { tituloDelDia } from '../agenda';
import type { DiaDeLaAgenda } from '../hooks/useDiaAgenda';
import type { ProduccionDelDia } from '../types';
import { textoUnidades } from '../textos';

type ProductoDelDia = ProduccionDelDia['productos'][number];

const textoPedidos = (cantidad: number) => (cantidad === 1 ? '1 pedido' : `${cantidad} pedidos`);

/**
 * «Qué hay que hacer»: la hoja de trabajo del día elegido. Los productos sumados de todos sus pedidos que falta
 * entregar, sin importar de quién son, y cuánto ya hizo de cada uno: con − y + arma la tanda que sacó y con «Agregar»
 * la suma; «Listo» lo completa (baja al final). Arriba, cuánto lleva del día. Lo hecho se guarda en el back recién al
 * tocar un botón: lo ven los dos admins
 */
export function HojaProduccion({ agenda }: { agenda: DiaDeLaAgenda }) {
  const styles = useStyles(createStyles);
  const { produccion } = agenda;
  const datos = produccion.datos;
  const haySinSena = datos?.productos.some((producto) => producto.sinSena > 0) ?? false;

  return (
    <HojaInferior
      visible={produccion.visible}
      alCerrar={produccion.cerrar}
      titulo="Qué hay que hacer"
      pie={<Button variant="ghost" label="Cerrar" onPress={produccion.cerrar} fullWidth />}
    >
      <View style={styles.contenido}>
        <View style={styles.resumen}>
          <Text variant="bodyStrong">{tituloDelDia(agenda.fecha)}</Text>
          {datos && datos.total > 0 && (
            <>
              <Text variant="caption" color="textMuted">
                {textoUnidades(datos.total)} de {textoPedidos(datos.pedidos)} sin entregar
              </Text>
              <Avance hechos={datos.hechos} total={datos.total} />
              <Text variant="caption" color={datos.hechos >= datos.total ? 'success' : 'text'}>
                {datos.hechos >= datos.total ? '¡Terminaste todo el día!' : `Hiciste ${datos.hechos} de ${datos.total}`}
              </Text>
            </>
          )}
        </View>

        {produccion.cargando && <Cargando tamano="chico" mensaje="Sumando los productos del día" />}
        {produccion.error && (
          <View style={styles.error}>
            <Alert tone="danger" message={produccion.error} />
            <Button variant="secondary" size="sm" label="Reintentar" onPress={produccion.reintentar} />
          </View>
        )}
        {datos && datos.productos.length === 0 && (
          <Text color="textMuted">No hay nada para preparar este día: no tiene pedidos sin entregar.</Text>
        )}

        {datos && datos.productos.length > 0 && (
          <View accessibilityRole="list">
            {datos.productos.map((producto, i) => (
              <FilaProduccion
                key={producto.productoId}
                producto={producto}
                separada={i > 0}
                tanda={produccion.tandaDe(producto.productoId)}
                alCambiarTanda={(cantidad) => produccion.cambiarTanda(producto.productoId, cantidad)}
                alAgregar={() => produccion.agregarTanda(producto.productoId, producto.hechos)}
                alTerminar={() => produccion.marcarListo(producto.productoId, producto.cantidad)}
                alDeshacer={() => produccion.deshacer(producto.productoId)}
                guardando={produccion.guardandoHechos === producto.productoId}
              />
            ))}
          </View>
        )}

        {haySinSena && (
          <Text variant="caption" color="textMuted">
            «Sin seña»: de pedidos que todavía no pagaron. Están sumados igual.
          </Text>
        )}
      </View>
    </HojaInferior>
  );
}

interface FilaProduccionProps {
  producto: ProductoDelDia;
  separada: boolean;
  /** Cuántos sacó ahora, antes de agregarlos */
  tanda: number;
  alCambiarTanda: (cantidad: number) => void;
  alAgregar: () => void;
  alTerminar: () => void;
  /** Uno listo por error: vuelve a 0 */
  alDeshacer: () => void;
  guardando: boolean;
}

/**
 * Un producto: cuántos hay que hacer y cuántos hizo. Con − y + arma la tanda (hasta lo que falta) y «Agregar» la suma;
 * «Listo» completa todo. Hecho, en verde con la tilde
 */
function FilaProduccion({
  producto,
  separada,
  tanda,
  alCambiarTanda,
  alAgregar,
  alTerminar,
  alDeshacer,
  guardando,
}: FilaProduccionProps) {
  const styles = useStyles(createStyles);
  const nombre = nombreParaMostrar(producto.nombre);

  return (
    <View style={[styles.fila, separada && styles.separada]}>
      <View style={styles.cabecera}>
        <View
          style={[styles.cantidad, producto.listo && styles.cantidadLista]}
          accessible
          accessibilityLabel={producto.listo ? `${nombre}: listo` : `${nombre}: hacer ${producto.cantidad}`}
        >
          {producto.listo ? (
            <Icon icon={Check} color="success" trazo="grueso" />
          ) : (
            <Text variant="title" color="primary">
              {producto.cantidad}
            </Text>
          )}
        </View>
        <View style={styles.datos}>
          <Text variant="bodyStrong" color={producto.listo ? 'textMuted' : 'text'}>
            {nombre}
          </Text>
          {producto.sinSena > 0 && !producto.listo && (
            <Text variant="caption" color="warning">
              {producto.sinSena === producto.cantidad ? 'Todos sin seña' : `${producto.sinSena} sin seña`}
            </Text>
          )}
        </View>
      </View>

      <Avance hechos={producto.hechos} total={producto.cantidad} />

      {producto.listo ? (
        <View style={styles.acciones}>
          <Text variant="caption" color="success">
            ¡Listo! {producto.cantidad} de {producto.cantidad}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            label="Deshacer"
            onPress={alDeshacer}
            loading={guardando}
            accessibilityLabel={`Deshacer: ${nombre} vuelve a 0 hechos`}
          />
        </View>
      ) : (
        <Text variant="caption" color="textMuted">
          Hechos {producto.hechos} · faltan {producto.faltan}
        </Text>
      )}

      {!producto.listo && (
        <View style={styles.acciones}>
          <ControlCantidad valor={tanda} alCambiar={alCambiarTanda} max={producto.faltan} nombre={`${nombre} para agregar`} />
          <View style={styles.botones}>
            {tanda > 0 && (
              <Button
                size="sm"
                icon={Plus}
                label={`Agregar ${tanda}`}
                onPress={alAgregar}
                loading={guardando}
                accessibilityLabel={`Agregar ${tanda} hechos de ${nombre}`}
              />
            )}
            <Button
              variant="success"
              size="sm"
              icon={Check}
              label="Listo"
              onPress={alTerminar}
              disabled={guardando}
              accessibilityLabel={`${nombre}: listo, los ${producto.cantidad}`}
            />
          </View>
        </View>
      )}
    </View>
  );
}

/** La barrita de avance: cuánto de lo pedido ya está hecho. Verde cuando está todo */
function Avance({ hechos, total }: { hechos: number; total: number }) {
  const styles = useStyles(createStyles);
  const parte = total > 0 ? Math.min(hechos / total, 1) : 0;

  return (
    <View style={styles.barra} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.relleno, parte >= 1 && styles.rellenoCompleto, { width: `${parte * 100}%` }]} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.md },
    resumen: { gap: theme.spacing.xs },
    error: { gap: theme.spacing.sm, alignItems: 'flex-start' },
    fila: { gap: theme.spacing.sm, paddingVertical: theme.spacing.md },
    separada: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    cabecera: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    // La cantidad, en una caja del mismo ancho para todas: los nombres quedan alineados
    cantidad: {
      minWidth: theme.sizes.control,
      minHeight: theme.sizes.control,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
    },
    cantidadLista: { backgroundColor: theme.colors.successSoft },
    datos: { flex: 1, gap: theme.spacing.xxs },
    acciones: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    botones: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    barra: {
      height: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
    },
    relleno: { height: '100%', borderRadius: theme.radius.full, backgroundColor: theme.colors.primary },
    rellenoCompleto: { backgroundColor: theme.colors.success },
  });
