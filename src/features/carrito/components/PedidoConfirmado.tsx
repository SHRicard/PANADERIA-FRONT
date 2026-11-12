import { StyleSheet, View } from 'react-native';
import { Car, CircleCheck, Store } from 'lucide-react-native';
import { Adorno, Button, Icon, Text } from '@/shared/ui/atoms';
import { formatearPrecio, nombreParaMostrar } from '@/shared/utils';
import { Destellos, IlustracionNavidad, Vivo, type Movimiento, type NombreAssetNavidad } from '@/features/catalogo';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { Cobro, Entrega } from '../sena';
import type { PedidoCreado } from '../types';
import { PagoSena } from './PagoSena';
import { ResumenPedido } from './ResumenPedido';
import { TEXTOS_PEDIDO_NAVIDAD } from '../textos';

interface PedidoConfirmadoProps {
  pedido: PedidoCreado;
  /** La seña y el resto: con la seña empiezan a prepararlo */
  cobro: Cobro | null;
  entrega: Entrega | null;
  alVolver: () => void;
  /** De Navidad: la escena con Papá Noel arriba, dibujos en la lista y en cómo lo recibe, y la despedida */
  navidad?: boolean;
}

// La escena de arriba (Navidad), de izquierda a derecha: Papá Noel en el medio, más grande
const ESCENA: { nombre: NombreAssetNavidad; como: Movimiento; centro?: boolean }[] = [
  { nombre: 'renoGorro', como: 'flotar' },
  { nombre: 'papaNoel', como: 'saludar', centro: true },
  { nombre: 'munecoNieveGorroPapaNoel', como: 'flotar' },
];

/**
 * Después de confirmar: el pedido como quedó en el back (con los precios que cobró), la seña y cuándo está listo. De
 * Navidad, en lugar del tilde, una escena con destellos dorados detrás (el reno y el muñeco de nieve flotan a los
 * costados de Papá Noel, que saluda); la lista lleva su título con la galletita, cómo lo recibe va con un dibujo (la
 * canasta o el regalo) y al final, entre dos ramitas de acebo, la despedida
 */
export function PedidoConfirmado({ pedido, cobro, entrega, alVolver, navidad = false }: PedidoConfirmadoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.confirmado}>
      <View style={styles.cabecera}>
        {navidad && <Destellos cantidad={10} color="accent" />}
        {navidad ? (
          <>
            <View style={styles.escena} aria-hidden>
              {ESCENA.map(({ nombre, como, centro }, i) => (
                <Vivo key={nombre} como={como} fase={i * 0.3}>
                  <IlustracionNavidad nombre={nombre} alto={centro ? theme.sizes.ilustracionVacio : theme.sizes.confirmadoLado} />
                </Vivo>
              ))}
            </View>
            <Text variant="overline" color="accent" align="center">
              {TEXTOS_PEDIDO_NAVIDAD.confirmado.temporada}
            </Text>
          </>
        ) : (
          <Icon icon={CircleCheck} size="xl" color="success" />
        )}
        <Text variant="display" align="center" accessibilityRole="header">
          ¡Recibimos tu pedido!
        </Text>
        <Text color="textMuted" align="center">
          {navidad
            ? TEXTOS_PEDIDO_NAVIDAD.confirmado.texto
            : 'Te vamos a contactar al teléfono que dejaste para coordinar la seña y la entrega.'}
        </Text>
      </View>
      <Adorno forma={navidad ? 'corto' : 'izquierda'} />
      <View style={styles.lista}>
        {navidad && (
          <View style={styles.tituloLista}>
            <IlustracionNavidad nombre="galletaEstrella" alto={theme.sizes.mascota} />
            <Text variant="title" style={styles.flexible}>
              {TEXTOS_PEDIDO_NAVIDAD.confirmado.lista}
            </Text>
          </View>
        )}
        {pedido.items.map((item) => (
          <View key={item.producto} style={styles.fila}>
            <Text style={styles.nombre}>
              {item.cantidad} × {nombreParaMostrar(item.nombre)}
            </Text>
            <Text style={styles.cifra}>{formatearPrecio(item.precio * item.cantidad)}</Text>
          </View>
        ))}
        <View style={styles.cuentas}>
          <ResumenPedido
            unidades={pedido.items.reduce((suma, { cantidad }) => suma + cantidad, 0)}
            total={pedido.total}
            cobro={cobro}
            entrega={entrega}
          />
        </View>
        {/* Cómo lo recibe: lo eligió al confirmar */}
        <View style={[styles.envio, navidad && styles.envioNavidad]}>
          {navidad ? (
            <IlustracionNavidad nombre={pedido.conEnvio ? 'regaloVerde' : 'canastaNavidena'} alto={theme.sizes.mascota} />
          ) : (
            <Icon icon={pedido.conEnvio ? Car : Store} color="primary" />
          )}
          <View style={styles.textos}>
            <Text variant="bodyStrong">{pedido.conEnvio ? 'Te lo llevamos' : 'Lo pasás a retirar'}</Text>
            <Text variant="caption" color="textMuted">
              {pedido.conEnvio ? 'La dirección la coordinamos por WhatsApp.' : 'Te avisamos por WhatsApp cuando esté listo.'}
            </Text>
          </View>
        </View>
      </View>
      {/* Cómo pagar la seña: transferencia o, en efectivo, por WhatsApp */}
      {cobro && <PagoSena pedido={pedido} sena={cobro.sena} />}
      {navidad && (
        <View style={styles.despedida}>
          <IlustracionNavidad nombre="acebo" alto={theme.sizes.mascota} />
          <Text variant="bodyStrong" color="accent" align="center" style={styles.flexible}>
            {TEXTOS_PEDIDO_NAVIDAD.confirmado.despedida}
          </Text>
          <IlustracionNavidad nombre="acebo" alto={theme.sizes.mascota} espejado />
        </View>
      )}
      <Button variant="ghost" label="Volver al catálogo" onPress={alVolver} fullWidth />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    confirmado: { gap: theme.spacing.lg },
    cabecera: { position: 'relative', alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.xl },
    // Los tres parados sobre la misma línea
    escena: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: theme.spacing.sm },
    tituloLista: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingBottom: theme.spacing.xs },
    flexible: { flexShrink: 1 },
    despedida: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm },
    lista: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md },
    nombre: { flex: 1 },
    cuentas: { paddingTop: theme.spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border },
    cifra: { fontVariant: ['tabular-nums'] },
    envio: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm, paddingTop: theme.spacing.sm },
    // De Navidad, el dibujo es más alto que el texto: centrados
    envioNavidad: { alignItems: 'center' },
    textos: { flex: 1, gap: theme.spacing.xxs },
  });
