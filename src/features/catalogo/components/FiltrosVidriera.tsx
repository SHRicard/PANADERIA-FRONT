import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { HojaInferior, Icon, Input, ListaOpcionesHoja, Text, type OpcionHoja } from '@/shared/ui/atoms';
import type { Categoria } from '@/features/productos';
import { useStyles, useTheme, type Theme } from '@/theme';

// Ningún gusto del back se llama así: es la opción de no filtrar
const TODOS_LOS_GUSTOS = '';

interface FiltrosVidrieraProps {
  texto: string;
  setTexto: (texto: string) => void;
  /** Los gustos con productos activos, con cuántos tiene cada uno */
  gustos: Categoria[];
  gusto: string | null;
  setGusto: (gusto: string | null) => void;
  /** Cuántos productos hay con estos filtros. null mientras cargan */
  total: number | null;
}

const cantidad = (total: number) => (total === 1 ? '1 producto' : `${total} productos`);

/**
 * El buscador y, a su lado, el botón que abre la hoja de gustos (el mismo patrón que la lista del dueño).
 * Abajo, cuántos productos hay y, con un gusto elegido, «Ver todos»
 */
export function FiltrosVidriera({ texto, setTexto, gustos, gusto, setGusto, total }: FiltrosVidrieraProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [abierta, setAbierta] = useState(false);
  const opciones = useMemo<OpcionHoja<string>[]>(
    () => [
      { valor: TODOS_LOS_GUSTOS, label: 'Todos los gustos' },
      ...gustos.map(({ nombre, cantidad }) => ({ valor: nombre, label: nombre, detalle: String(cantidad) })),
    ],
    [gustos],
  );

  return (
    <View style={styles.filtros}>
      <View style={styles.fila}>
        <View style={styles.buscar}>
          <Input
            icon={Search}
            value={texto}
            onChangeText={setTexto}
            placeholder="Buscar por nombre"
            accessibilityLabel="Buscar por nombre"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        <Pressable
          onPress={() => setAbierta(true)}
          accessibilityRole="button"
          accessibilityLabel="Filtrar por gusto"
          accessibilityValue={gusto ? { text: gusto } : undefined}
          style={({ pressed }) => [styles.boton, gusto && styles.botonPuesto, pressed && styles.presionado]}
        >
          <Icon icon={SlidersHorizontal} color={gusto ? 'primary' : 'text'} />
          {gusto && (
            <View style={styles.insignia}>
              <Text variant="caption" color="onPrimary" style={styles.negrita}>
                1
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {total !== null && (
        <View style={styles.resumen}>
          <Text variant="caption" color="textMuted" style={styles.textoResumen}>
            {gusto ? <Text variant="caption" style={styles.fuerte}>{`${gusto} · `}</Text> : null}
            {cantidad(total)}
          </Text>
          {gusto && (
            <Pressable
              onPress={() => setGusto(null)}
              accessibilityRole="button"
              accessibilityLabel="Ver todos los gustos"
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

      <HojaInferior visible={abierta} alCerrar={() => setAbierta(false)} titulo="Filtrar por gusto">
        {gustos.length > 0 ? (
          <ListaOpcionesHoja
            opciones={opciones}
            valor={gusto ?? TODOS_LOS_GUSTOS}
            alElegir={(elegido) => {
              setGusto(elegido || null);
              setAbierta(false);
            }}
            accessibilityLabel="Gusto"
          />
        ) : (
          <Text variant="caption" color="textMuted">
            Cargando gustos…
          </Text>
        )}
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
  });
