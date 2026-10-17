import { StyleSheet, View } from 'react-native';
import { useWatch, type Control, type UseFormSetFocus } from 'react-hook-form';
import { CampoTexto } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { LARGO_TITULO, MAX_TEXTO } from '../schemas';
import type { FormularioPromo } from '../types';

interface CamposPromoProps {
  control: Control<FormularioPromo>;
  enfocar: UseFormSetFocus<FormularioPromo>;
}

/** El título y el texto de una promo: los mismos en el alta y en la edición */
export function CamposPromo({ control, enfocar }: CamposPromoProps) {
  const styles = useStyles(createStyles);
  const texto = useWatch({ control, name: 'texto' });

  return (
    <View style={styles.campos}>
      <CampoTexto
        control={control}
        name="titulo"
        label="Título"
        placeholder="2x1 en medialunas"
        helper="Para reconocerla en la lista: no sale en el estado."
        autoCapitalize="sentences"
        maxLength={LARGO_TITULO.max}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => enfocar('texto')}
      />
      <CampoTexto
        control={control}
        name="texto"
        label="Texto"
        placeholder={'Hoy 2x1\nHasta las 12'}
        helper={`Opcional: acompaña la foto o el video en tu estado. ${texto.length}/${MAX_TEXTO}`}
        autoCapitalize="sentences"
        maxLength={MAX_TEXTO}
        multiline
      />
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({ campos: { gap: theme.spacing.md } });
