import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HojaInferior,
  ListaOpcionesHoja,
  Segmentado,
  Text,
  type OpcionHoja,
  type OpcionSegmentado,
} from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import type { EstadoProducto } from '../types';

export const ESTADOS_FILTRO: OpcionSegmentado<EstadoProducto | 'todos'>[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'activo', label: 'Activos' },
  { valor: 'pausado', label: 'Pausados' },
];

// Ningún gusto del back se llama así: es la opción de no filtrar
const TODOS_LOS_GUSTOS = '';

interface HojaFiltrosProps {
  visible: boolean;
  alCerrar: () => void;
  estado: EstadoProducto | null;
  alCambiarEstado: (estado: EstadoProducto | null) => void;
  /** Los gustos de la lista fija del back (useCategorias) */
  categorias: string[];
  categoria: string | null;
  alCambiarCategoria: (categoria: string | null) => void;
  /** Cuántos productos hay con los filtros puestos. null mientras cargan */
  total: number | null;
}

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/** El estado y el gusto. Se aplican en el momento: la lista de atrás ya cambia mientras se elige */
export function HojaFiltros({
  visible,
  alCerrar,
  estado,
  alCambiarEstado,
  categorias,
  categoria,
  alCambiarCategoria,
  total,
}: HojaFiltrosProps) {
  const styles = useStyles(createStyles);
  const gustos = useMemo<OpcionHoja<string>[]>(
    () => [
      { valor: TODOS_LOS_GUSTOS, label: 'Todos los gustos' },
      ...categorias.map((gusto) => ({ valor: gusto, label: gusto })),
    ],
    [categorias],
  );

  return (
    <HojaInferior
      visible={visible}
      alCerrar={alCerrar}
      titulo="Filtros"
      pie={
        <Button
          label={total === null ? 'Ver productos' : total === 0 ? 'Ningún producto coincide' : `Ver ${cantidad(total)}`}
          onPress={alCerrar}
          fullWidth
        />
      }
    >
      <View style={styles.grupo}>
        <Text variant="label" color="textMuted">
          Estado
        </Text>
        <Segmentado
          opciones={ESTADOS_FILTRO}
          valor={estado ?? 'todos'}
          alCambiar={(elegido) => alCambiarEstado(elegido === 'todos' ? null : elegido)}
          accessibilityLabel="Estado"
        />
      </View>
      <View style={styles.grupo}>
        <Text variant="label" color="textMuted">
          Gusto
        </Text>
        {categorias.length > 0 ? (
          <ListaOpcionesHoja
            opciones={gustos}
            valor={categoria ?? TODOS_LOS_GUSTOS}
            alElegir={(elegido) => alCambiarCategoria(elegido || null)}
            accessibilityLabel="Gusto"
          />
        ) : (
          <Text variant="caption" color="textMuted">
            Cargando gustos…
          </Text>
        )}
      </View>
    </HojaInferior>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grupo: { gap: theme.spacing.sm },
  });
