import { StyleSheet, View } from 'react-native';
import { Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type ColorToken, type Theme } from '@/theme';
import { ICONO_QUIERE_HACER, MARCA_CASI, MARCA_LIBRE, MARCA_LLENA, rangosDeLaAgenda } from '../agenda';

/**
 * Qué quiere decir cada color, con los números del tope del dueño: con 25, «Libre» hasta 10, «Casi» de 11 a 24 y
 * «Llena» desde 25 o si la marca. Las mismas casillas del calendario, en chico
 */
export function LeyendaAgenda({ productosPorDia }: { productosPorDia: number }) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const { hastaLibre, desdeCasi, hastaCasi, tope } = rangosDeLaAgenda(productosPorDia);

  const estados: { marca: string; color: ColorToken; fondo: ColorToken; texto: string }[] = [
    { marca: MARCA_LIBRE, color: 'success', fondo: 'successSoft', texto: `hasta ${hastaLibre}` },
    {
      marca: MARCA_CASI,
      color: 'warning',
      fondo: 'warningSoft',
      texto: desdeCasi < hastaCasi ? `de ${desdeCasi} a ${hastaCasi}` : `${desdeCasi}`,
    },
    { marca: MARCA_LLENA, color: 'danger', fondo: 'dangerSoft', texto: `desde ${tope} o si la marcás` },
  ];

  return (
    <View style={styles.leyenda}>
      {estados.map(({ marca, color, fondo, texto }) => (
        <View key={marca} style={styles.item}>
          <View style={[styles.marca, { borderColor: theme.colors[color], backgroundColor: theme.colors[fondo] }]}>
            <Text variant="caption" color={color}>
              {marca}
            </Text>
          </View>
          <Text variant="caption" color="textMuted">
            {texto}
          </Text>
        </View>
      ))}
      <View style={styles.item}>
        <Icon icon={ICONO_QUIERE_HACER} size="xs" color="primary" />
        <Text variant="caption" color="textMuted">
          un día en que querés hacer menos
        </Text>
      </View>
      <Text variant="caption" color="textMuted">
        «Llena» no se ofrece en la web. Vos podés seguir cargando pedidos.
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    leyenda: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: theme.spacing.md, rowGap: theme.spacing.sm },
    item: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    marca: {
      paddingHorizontal: theme.spacing.xs,
      borderWidth: 1,
      borderRadius: theme.radius.sm,
    },
  });
