import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Button, HojaInferior, Icon, Input, ListaOpcionesHoja, Text, type OpcionHoja } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { useFiltrosCatalogo } from '../hooks/useFiltrosCatalogo';
import type { OpcionFiltro } from '../types';

// Ningún tipo ni gusto del back tiene ese valor: es la opción de no filtrar
const TODOS = '';

interface FiltrosVidrieraProps {
  filtros: ReturnType<typeof useFiltrosCatalogo>;
  /** Cuántos productos hay con estos filtros. null mientras cargan */
  total: number | null;
}

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

const deLaHoja = (todos: string, opciones: OpcionFiltro[]): OpcionHoja<string>[] => [
  { valor: TODOS, label: todos },
  ...opciones.map(({ valor, label, cantidad: deEsa }) => ({ valor, label, detalle: String(deEsa) })),
];

/**
 * El buscador y, a su lado, el botón que abre la hoja con el tipo y el gusto (el mismo patrón que la lista del
 * dueño). Abajo, cuántos productos hay y, con un filtro puesto, cuál y «Ver todos»
 */
export function FiltrosVidriera({ filtros, total }: FiltrosVidrieraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [abierta, setAbierta] = useState(false);
  const tipos = useMemo(() => deLaHoja('Todos los tipos', filtros.tipos), [filtros.tipos]);
  const gustos = useMemo(() => deLaHoja('Todos los gustos', filtros.gustos), [filtros.gustos]);
  const puestos = filtros.filtrosPuestos;
  const resumen = [filtros.nombreTipo, filtros.gusto].filter(Boolean).join(' · ');

  return (
    <View style={styles.filtros}>
      <View style={styles.fila}>
        <View style={styles.buscar}>
          <Input
            icon={Search}
            value={filtros.texto}
            onChangeText={filtros.setTexto}
            placeholder="Buscar por nombre"
            accessibilityLabel="Buscar por nombre"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        <Pressable
          onPress={() => setAbierta(true)}
          accessibilityRole="button"
          accessibilityLabel="Filtros"
          accessibilityValue={resumen ? { text: resumen } : undefined}
          style={({ pressed }) => [styles.boton, puestos > 0 && styles.botonPuesto, pressed && styles.presionado]}
        >
          <Icon icon={SlidersHorizontal} color={puestos > 0 ? 'primary' : 'text'} />
          {puestos > 0 && (
            <View style={styles.insignia}>
              <Text variant="caption" color="onPrimary" style={styles.negrita}>
                {puestos}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {total !== null && (
        <View style={styles.resumen}>
          <Text variant="caption" color="textMuted" style={styles.textoResumen}>
            {resumen ? <Text variant="caption" style={styles.fuerte}>{`${resumen} · `}</Text> : null}
            {cantidad(total)}
          </Text>
          {puestos > 0 && (
            <Pressable
              onPress={filtros.limpiarHoja}
              accessibilityRole="button"
              accessibilityLabel="Sacar los filtros"
              hitSlop={theme.spacing.md}
              style={({ pressed }) => pressed && styles.presionado}
            >
              <Text variant="label" color="primary" style={styles.negrita}>
                Ver todos
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Se aplican en el momento: la grilla de atrás ya cambia mientras se elige */}
      <HojaInferior
        visible={abierta}
        alCerrar={() => setAbierta(false)}
        titulo="Filtros"
        pie={
          <Button
            label={total === null ? 'Ver productos' : total === 0 ? 'Ningún producto coincide' : `Ver ${cantidad(total)}`}
            onPress={() => setAbierta(false)}
            fullWidth
          />
        }
      >
        {!filtros.sinTipos && (
          <View style={styles.grupo}>
            <Text variant="label" color="textMuted">
              Tipo
            </Text>
            {filtros.tipos.length > 0 ? (
              <ListaOpcionesHoja
                opciones={tipos}
                valor={filtros.tipo ?? TODOS}
                alElegir={(elegido) => filtros.setTipo(elegido || null)}
                accessibilityLabel="Tipo"
              />
            ) : (
              <Text variant="caption" color="textMuted">
                Cargando tipos…
              </Text>
            )}
          </View>
        )}
        <View style={styles.grupo}>
          <Text variant="label" color="textMuted">
            Gusto
          </Text>
          {filtros.gustos.length > 0 ? (
            <ListaOpcionesHoja
              opciones={gustos}
              valor={filtros.gusto ?? TODOS}
              alElegir={(elegido) => filtros.setGusto(elegido || null)}
              accessibilityLabel="Gusto"
            />
          ) : (
            <Text variant="caption" color="textMuted">
              Cargando gustos…
            </Text>
          )}
        </View>
      </HojaInferior>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    filtros: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', gap: theme.spacing.sm },
    buscar: { flex: 1 },
    boton: {
      width: theme.sizes.control,
      height: theme.sizes.control,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    botonPuesto: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
    presionado: { opacity: theme.opacity.pressed },
    insignia: {
      position: 'absolute',
      top: -(theme.spacing.xs + theme.spacing.xxs),
      right: -(theme.spacing.xs + theme.spacing.xxs),
      minWidth: theme.sizes.insignia,
      height: theme.sizes.insignia,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 2,
      borderColor: theme.colors.background,
      backgroundColor: theme.colors.primary,
    },
    negrita: { fontFamily: theme.fonts.textoNegrita },
    resumen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md },
    textoResumen: { flex: 1 },
    fuerte: { fontFamily: theme.fonts.textoNegrita, color: theme.colors.text },
    grupo: { gap: theme.spacing.sm },
  });
