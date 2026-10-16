import { StyleSheet, View } from 'react-native';
import { LogOut, Palette, Settings } from 'lucide-react-native';
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
