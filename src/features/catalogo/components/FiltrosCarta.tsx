import { StyleSheet, View } from 'react-native';
import { Cookie, Search, Tags } from 'lucide-react-native';
import { useBreakpoint } from '@/shared/hooks';
import { Input } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { useFiltrosCatalogo } from '../hooks/useFiltrosCatalogo';
import { SelectorFiltro } from './SelectorFiltro';

interface FiltrosCartaProps {
  filtros: ReturnType<typeof useFiltrosCatalogo>;
}

/**
 * El buscador, el tipo y el gusto. En la compu, los tres en una fila; en el celular, el buscador arriba y los dos
 * selectores abajo, lado a lado. Si ningún producto activo tiene tipo, no va ese selector
 */
export function FiltrosCarta({ filtros }: FiltrosCartaProps) {
  const styles = useStyles(createStyles);
  const enFila = useBreakpoint() !== 'celular';

  return (
    <View style={[styles.filtros, enFila && styles.enFila]}>
      <View style={enFila && styles.buscar}>
        <Input
          icon={Search}
          value={filtros.texto}
          onChangeText={filtros.setTexto}
          placeholder="Tarta, chipá, brownie…"
          accessibilityLabel="Buscar por nombre"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      <View style={[styles.selectores, enFila && styles.selectoresEnFila]}>
        {!filtros.sinTipos && (
          <View style={styles.selector}>
            <SelectorFiltro
              etiqueta="Tipo"
              icono={Tags}
              todos="Todos los tipos"
              cantidadTodos={filtros.totalActivos}
              tituloHoja="¿Qué estás buscando?"
              opciones={filtros.tipos}
              valor={filtros.tipo}
              alCambiar={filtros.setTipo}
            />
          </View>
        )}
        <View style={styles.selector}>
          <SelectorFiltro
            etiqueta="Gusto"
            icono={Cookie}
            todos="Todos los gustos"
            cantidadTodos={filtros.totalActivos}
            tituloHoja="¿Qué gusto buscás?"
            opciones={filtros.gustos}
            valor={filtros.gusto}
            alCambiar={filtros.setGusto}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    filtros: { gap: theme.spacing.sm },
    enFila: { flexDirection: 'row', alignItems: 'center', maxWidth: theme.sizes.cartaMax },
    buscar: { flex: 3, minWidth: 0 },
    selectores: { flexDirection: 'row', gap: theme.spacing.sm },
    // En la fila de la compu, los dos selectores parejos al lado del buscador
    selectoresEnFila: { flex: 4, minWidth: 0 },
    selector: { flex: 1, minWidth: 0 },
  });
