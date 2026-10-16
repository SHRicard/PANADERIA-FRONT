import { StyleSheet, View } from 'react-native';
import { Search } from 'lucide-react-native';
import type { Categoria } from '@/features/productos';
import { useBreakpoint } from '@/shared/hooks';
import { Input } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { SelectorGusto } from './SelectorGusto';

interface FiltrosCartaProps {
  texto: string;
  setTexto: (texto: string) => void;
  gustos: Categoria[];
  gusto: string | null;
  setGusto: (gusto: string | null) => void;
}

/** El buscador y el gusto: en la compu uno al lado del otro; en el celular, uno abajo del otro */
export function FiltrosCarta({ texto, setTexto, gustos, gusto, setGusto }: FiltrosCartaProps) {
  const styles = useStyles(createStyles);
  const enFila = useBreakpoint() !== 'celular';

  return (
    <View style={[styles.filtros, enFila && styles.enFila]}>
      <View style={enFila && styles.buscar}>
        <Input
          icon={Search}
          value={texto}
          onChangeText={setTexto}
          placeholder="Tarta, chipá, brownie…"
          accessibilityLabel="Buscar por nombre"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      <View style={enFila && styles.gusto}>
        <SelectorGusto gustos={gustos} gusto={gusto} alCambiar={setGusto} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    filtros: { gap: theme.spacing.sm },
    enFila: { flexDirection: 'row', alignItems: 'center', maxWidth: theme.sizes.cartaMax },
    buscar: { flex: 3, minWidth: 0 },
    gusto: { flex: 2, minWidth: 0 },
  });
