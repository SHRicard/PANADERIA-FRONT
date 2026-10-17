import { StyleSheet, View } from 'react-native';
import { ClipboardPlus, LogOut, Megaphone, Palette, Settings, Wallet, Wheat } from 'lucide-react-native';
import { PantallaPestana } from '@/features/navegacion';
import { useStyles, type Theme } from '@/theme';
import { OpcionMenu } from '../components/OpcionMenu';
import { TarjetaUsuario } from '../components/TarjetaUsuario';
import { useMas } from '../hooks/useMas';

// Un menú, no una pantalla de contenido: cada fila lleva a otro lado o dispara una acción.
// Grupos por familia, separados por aire; cerrar sesión, solo y al fondo. El usuario sale de la sesión
// ya cargada (no de la API): no lleva useRefrescar
export function MasScreen() {
  const styles = useStyles(createStyles);
  const mas = useMas();

  return (
    <PantallaPestana pestana="mas" llenarAlto>
      <View style={styles.cuerpo}>
        <View style={styles.arriba}>
          <TarjetaUsuario usuario={mas.usuario} />

          {/* Los pedidos que llegan por fuera de la web: la app como agenda */}
          <View style={styles.grupo}>
            <OpcionMenu
              icono={ClipboardPlus}
              titulo="Pedido manual"
              descripcion="Cargá un pedido que te hicieron por WhatsApp o en persona"
              onPress={mas.abrirPedidoManual}
            />
          </View>

          {/* Los gastos: lo que compra para producir */}
          <View style={styles.grupo}>
            <OpcionMenu
              icono={Wheat}
              titulo="Insumos"
              descripcion="Lo que comprás para producir y cuánto pagaste"
              onPress={mas.abrirInsumos}
            />
          </View>

          {/* La difusión: lo que publica en su estado de WhatsApp */}
          <View style={styles.grupo}>
            <OpcionMenu
              icono={Megaphone}
              titulo="Promos"
              descripcion="Fotos y videos para compartir en tu estado"
              onPress={mas.abrirPromos}
            />
          </View>

          {/* El negocio: lo que ven los clientes para pagar */}
          <View style={styles.grupo}>
            <OpcionMenu
              icono={Wallet}
              titulo="Billetera"
              descripcion="La cuenta a la que te transfieren la seña"
              onPress={mas.abrirBilletera}
            />
          </View>

          <View style={styles.grupo}>
            <OpcionMenu
              icono={Settings}
              titulo="Preferencias"
              descripcion="Tema, letra, pestañas, encabezado y catálogo web"
              onPress={mas.abrirPreferencias}
            />
          </View>

          {/* Solo mientras se desarrolla: no llega a la APK de release */}
          {__DEV__ && (
            <View style={styles.grupo}>
              <OpcionMenu
                icono={Palette}
                titulo="Diseño del sistema"
                descripcion="Colores, letras y piezas de la app (solo en desarrollo)"
                onPress={mas.abrirDiseno}
              />
            </View>
          )}
        </View>

        <View style={styles.grupo}>
          <OpcionMenu icono={LogOut} titulo="Cerrar sesión" onPress={mas.cerrarSesion} tono="peligro" navega={false} />
        </View>
      </View>
    </PantallaPestana>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Lo de arriba, y cerrar sesión abajo de todo
    cuerpo: { flex: 1, justifyContent: 'space-between', gap: theme.spacing.md },
    arriba: { gap: theme.spacing.md },
    grupo: { gap: theme.spacing.sm },
  });
