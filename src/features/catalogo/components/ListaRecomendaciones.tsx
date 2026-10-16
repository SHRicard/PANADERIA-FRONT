import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import type { Recomendacion } from '@/features/productos';
import { Button, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { fechaRecomendacion, TEXTO_PUNTAJE, textoPromedio, textoVotos } from '../textos';
import { Estrellas } from './Estrellas';

interface ListaRecomendacionesProps {
  recomendaciones: Recomendacion[];
  /** null si nadie lo votó todavía */
  promedio: number | null;
  cantidad: number;
}

// Las primeras se ven; el resto, con «Ver todas»
const A_LA_VISTA = 3;

/** Lo que dicen los que ya lo probaron: el promedio arriba y cada recomendación, de la más nueva a la más vieja */
export function ListaRecomendaciones({ recomendaciones, promedio, cantidad }: ListaRecomendacionesProps) {
  const styles = useStyles(createStyles);
  const [todas, setTodas] = useState(false);
  const visibles = todas ? recomendaciones : recomendaciones.slice(0, A_LA_VISTA);

  if (promedio === null || recomendaciones.length === 0) {
    return (
      <View style={styles.vacio}>
        <Icon icon={Trophy} size="xl" color="accent" />
        <Text variant="subtitle" align="center">
          Todavía nadie lo votó
        </Text>
        <Text color="textMuted" align="center">
          El primer voto es el que más cuenta: ¿lo estrenás vos?
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.lista}>
      <Text variant="subtitle">Lo que dicen los que lo probaron</Text>
      <View style={styles.resumen}>
        <Text variant="display" style={styles.cifra}>
          {textoPromedio(promedio)}
        </Text>
        <View style={styles.resumenDatos}>
          <Estrellas puntaje={promedio} tamano="md" />
          <Text variant="caption" color="textMuted">
            {textoVotos(cantidad)}
          </Text>
        </View>
      </View>

      {visibles.map((recomendacion) => (
        <View key={recomendacion.id} style={styles.recomendacion}>
          <View style={styles.cabecera}>
            <Estrellas puntaje={recomendacion.puntaje} />
            <Text variant="caption" color="textMuted">
              {fechaRecomendacion(recomendacion.createdAt)}
            </Text>
          </View>
          {/* Sin texto, lo que dice su puntaje: así ninguna queda muda */}
          {recomendacion.texto ? (
            <Text>{recomendacion.texto}</Text>
          ) : (
            <Text color="textMuted" style={styles.sinTexto}>
              {TEXTO_PUNTAJE[recomendacion.puntaje]}
            </Text>
          )}
          <Text variant="label" color="textMuted">
            {recomendacion.autor ? `— ${recomendacion.autor}` : '— Alguien que lo probó'}
          </Text>
        </View>
      ))}

      {recomendaciones.length > A_LA_VISTA && (
        <Button
          variant="ghost"
          size="sm"
          label={todas ? 'Ver menos' : `Ver las ${recomendaciones.length} recomendaciones`}
          onPress={() => setTodas((antes) => !antes)}
        />
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    lista: { gap: theme.spacing.md },
    resumen: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    cifra: { fontVariant: ['tabular-nums'] },
    resumenDatos: { gap: theme.spacing.xxs },
    recomendacion: {
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
    sinTexto: { fontStyle: 'italic' },
    vacio: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xl },
  });
