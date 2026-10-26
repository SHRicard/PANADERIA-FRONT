import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown, X, type LucideIcon } from 'lucide-react-native';
import { HojaInferior, Icon, ListaOpcionesHoja, Text, type OpcionHoja } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { OpcionFiltro } from '../types';

// Ningún tipo ni gusto del back tiene ese valor: es la opción de no filtrar
const TODOS = '';

interface SelectorFiltroProps {
  /** Qué filtra («Tipo», «Gusto»): va chico arriba del valor */
  etiqueta: string;
  icono: LucideIcon;
  /** La opción de no filtrar, en la hoja: «Todos los tipos» */
  todos: string;
  /** Cuántos productos activos hay en total, para la opción de no filtrar */
  cantidadTodos: number;
  tituloHoja: string;
  /** Las opciones con productos activos, en el orden del back */
  opciones: OpcionFiltro[];
  /** El elegido; null = todos */
  valor: string | null;
  alCambiar: (valor: string | null) => void;
}

/**
 * Filtrar la carta por tipo o por gusto. Se ve como un campo, al lado del buscador; al tocarlo sube la lista con
 * cuántos productos tiene cada opción. Con una elegida se marca en dorado y la X la saca
 */
export function SelectorFiltro({
  etiqueta,
  icono,
  todos,
  cantidadTodos,
  tituloHoja,
  opciones,
  valor,
  alCambiar,
}: SelectorFiltroProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [abierto, setAbierto] = useState(false);
  const deLaHoja = useMemo<OpcionHoja<string>[]>(
    () => [
      { valor: TODOS, label: todos, detalle: String(cantidadTodos) },
      ...opciones.map((opcion) => ({ valor: opcion.valor, label: opcion.label, detalle: String(opcion.cantidad) })),
    ],
    [opciones, todos, cantidadTodos],
  );
  const elegida = opciones.find((opcion) => opcion.valor === valor);
  const puesto = Boolean(valor);
  // En el campo alcanza con «Todos»: arriba ya dice qué filtra
  const texto = elegida?.label ?? 'Todos';

  return (
    <>
      {/* La X va al lado del botón que abre la lista, no adentro: en la web un botón no puede ir dentro de otro */}
      <View style={[styles.caja, puesto && styles.puesto]}>
        <Pressable
          onPress={() => setAbierto(true)}
          disabled={opciones.length === 0}
          accessibilityRole="combobox"
          accessibilityLabel={etiqueta}
          accessibilityValue={{ text: elegida?.label ?? todos }}
          accessibilityState={{ expanded: abierto, disabled: opciones.length === 0 }}
          style={({ pressed }) => [styles.abrir, pressed && styles.presionada]}
        >
          <Icon icon={icono} color={puesto ? 'primary' : 'textMuted'} />
          <View style={styles.textos}>
            <Text variant="caption" color="textMuted">
              {etiqueta}
            </Text>
            <Text variant="bodyStrong" numberOfLines={1}>
              {texto}
            </Text>
          </View>
          <Icon icon={ChevronDown} color={puesto ? 'primary' : 'textMuted'} />
        </Pressable>
        {puesto ? (
          <Pressable
            onPress={() => alCambiar(null)}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${todos.toLocaleLowerCase('es-AR')}`}
            hitSlop={theme.spacing.xs}
            style={({ pressed }) => [styles.quitar, pressed && styles.presionada]}
          >
            <Icon icon={X} size="sm" color="primary" />
          </Pressable>
        ) : null}
      </View>

      <HojaInferior visible={abierto} alCerrar={() => setAbierto(false)} titulo={tituloHoja}>
        <ListaOpcionesHoja
          opciones={deLaHoja}
          valor={valor ?? TODOS}
          alElegir={(elegido) => {
            alCambiar(elegido || null);
            setAbierto(false);
          }}
          accessibilityLabel={etiqueta}
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
