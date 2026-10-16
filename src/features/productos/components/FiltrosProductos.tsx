import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Icon, Input, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';
import type { useProductos } from '../hooks/useProductos';
import { ESTADOS_FILTRO, HojaFiltros } from './HojaFiltros';

interface FiltrosProductosProps {
  filtros: ReturnType<typeof useProductos>['filtros'];
  /** Cuántos productos hay con los filtros puestos. null mientras cargan */
  total: number | null;
}

/**
 * El buscador y, a su lado, el botón que abre la hoja con el estado y el gusto. Con filtros puestos, el
 * botón se marca con cuántos son y abajo se lee cuáles, con «Limpiar»
 */
export function FiltrosProductos({ filtros, total }: FiltrosProductosProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [abierta, setAbierta] = useState(false);
  const puestos = filtros.filtrosPuestos;
  const resumen = [
    filtros.categoria,
    filtros.estado && ESTADOS_FILTRO.find(({ valor }) => valor === filtros.estado)?.label,
  ].filter(Boolean);

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
          accessibilityValue={puestos > 0 ? { text: puestos === 1 ? '1 filtro puesto' : `${puestos} filtros puestos` } : undefined}
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

      {resumen.length > 0 && (
        <View style={styles.resumen}>
          <Text variant="caption" color="textMuted" style={styles.textoResumen}>
            Filtrando: <Text variant="caption" style={styles.fuerte}>{resumen.join(' · ')}</Text>
          </Text>
          <Pressable
            onPress={filtros.limpiarHoja}
            accessibilityRole="button"
            accessibilityLabel="Limpiar filtros"
            // Para el dedo: el texto solo es chico
            hitSlop={theme.spacing.md}
            style={({ pressed }) => pressed && styles.presionado}
          >
            <Text variant="label" color="primary" style={styles.negrita}>
              Limpiar
            </Text>
          </Pressable>
        </View>
      )}

      <HojaFiltros
        visible={abierta}
        alCerrar={() => setAbierta(false)}
        estado={filtros.estado}
        alCambiarEstado={filtros.setEstado}
        categorias={filtros.categorias}
        categoria={filtros.categoria}
        alCambiarCategoria={filtros.setCategoria}
        total={total}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    filtros: { gap: theme.spacing.sm },
    fila: { flexDirection: 'row', gap: theme.spacing.sm },
    buscar: { flex: 1 },
    // Cuadrado y del alto del buscador: se lee como parte de la misma fila
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
      // El borde del color del fondo la despega del botón
      borderWidth: 2,
      borderColor: theme.colors.background,
      backgroundColor: theme.colors.primary,
    },
    negrita: { fontFamily: theme.fonts.textoNegrita },
    resumen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md },
    textoResumen: { flex: 1 },
    fuerte: { fontFamily: theme.fonts.textoNegrita, color: theme.colors.text },
  });
