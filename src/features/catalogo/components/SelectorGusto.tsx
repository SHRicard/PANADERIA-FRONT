import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown, Cookie, X } from 'lucide-react-native';
import type { Categoria } from '@/features/productos';
import { HojaInferior, Icon, ListaOpcionesHoja, Text, type OpcionHoja } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

// Ningún gusto del back se llama así: es la opción de no filtrar
const TODOS_LOS_GUSTOS = '';

interface SelectorGustoProps {
  /** Los gustos con productos activos, con cuántos tiene cada uno */
  gustos: Categoria[];
  gusto: string | null;
  alCambiar: (gusto: string | null) => void;
}

/**
 * Filtrar la carta por gusto. Se ve como un campo, al lado del buscador; al tocarlo sube la lista de gustos
 * con cuántos productos tiene cada uno. Con un gusto elegido se marca en dorado y la X lo saca
 */
export function SelectorGusto({ gustos, gusto, alCambiar }: SelectorGustoProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [abierto, setAbierto] = useState(false);
  const opciones = useMemo<OpcionHoja<string>[]>(
    () => [
      {
        valor: TODOS_LOS_GUSTOS,
        label: 'Todos los gustos',
        detalle: String(gustos.reduce((suma, { cantidad }) => suma + cantidad, 0)),
      },
      ...gustos.map(({ nombre, cantidad }) => ({ valor: nombre, label: nombre, detalle: String(cantidad) })),
    ],
    [gustos],
  );

  return (
    <>
      {/* La X va al lado del botón que abre la lista, no adentro: en la web un botón no puede ir dentro de otro */}
      <View style={[styles.caja, gusto && styles.puesto]}>
        <Pressable
          onPress={() => setAbierto(true)}
          disabled={gustos.length === 0}
          accessibilityRole="combobox"
          accessibilityLabel="Gusto"
          accessibilityValue={{ text: gusto ?? 'Todos los gustos' }}
          accessibilityState={{ expanded: abierto, disabled: gustos.length === 0 }}
          style={({ pressed }) => [styles.abrir, pressed && styles.presionada]}
        >
          <Icon icon={Cookie} color={gusto ? 'primary' : 'textMuted'} />
          <View style={styles.textos}>
            <Text variant="caption" color="textMuted">
              Gusto
            </Text>
            <Text variant="bodyStrong" numberOfLines={1}>
              {gusto ?? 'Todos los gustos'}
            </Text>
          </View>
          <Icon icon={ChevronDown} color={gusto ? 'primary' : 'textMuted'} />
        </Pressable>
        {gusto ? (
          <Pressable
            onPress={() => alCambiar(null)}
            accessibilityRole="button"
            accessibilityLabel="Ver todos los gustos"
            hitSlop={theme.spacing.xs}
            style={({ pressed }) => [styles.quitar, pressed && styles.presionada]}
          >
            <Icon icon={X} size="sm" color="primary" />
          </Pressable>
        ) : null}
      </View>

      <HojaInferior visible={abierto} alCerrar={() => setAbierto(false)} titulo="¿Qué gusto buscás?">
        <ListaOpcionesHoja
          opciones={opciones}
          valor={gusto ?? TODOS_LOS_GUSTOS}
          alElegir={(elegido) => {
            alCambiar(elegido || null);
            setAbierto(false);
          }}
          accessibilityLabel="Gusto"
        />
      </HojaInferior>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Del alto del buscador y con su mismo borde: se leen como un par
    caja: {
      minHeight: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    puesto: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
    presionada: { opacity: theme.opacity.pressed },
    abrir: {
      flex: 1,
      minHeight: theme.sizes.control,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingLeft: theme.spacing.md,
      paddingVertical: theme.spacing.xxs,
    },
    textos: { flex: 1, minWidth: 0 },
    quitar: {
      width: theme.sizes.iconoPestanaChico,
      height: theme.sizes.iconoPestanaChico,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
    },
  });
