import { StyleSheet, View } from 'react-native';
import { CalendarMinus, CalendarPlus } from 'lucide-react-native';
import { Button, HojaInferior, OpcionMenu, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { MENSAJE_DIA_LLENO, TITULO_DIA_LLENO } from '../entrega';

export interface OpcionDia {
  dia: string;
  /** «El día antes» o «El día después» */
  titulo: string;
  /** «jueves 19 de noviembre» */
  texto: string;
  /** Si es anterior al día lleno (cambia el ícono) */
  antes: boolean;
}

export interface HojaDiaLlenoProps {
  visible: boolean;
  /** El día libre más cercano antes y después del lleno (los que haya) */
  opciones: OpcionDia[];
  alElegir: (dia: string) => void;
  alCerrar: () => void;
}

/** Se abre al tocar un día con la agenda llena: lo explica y ofrece, con un toque, el día de antes o el de después */
export function HojaDiaLleno({ visible, opciones, alElegir, alCerrar }: HojaDiaLlenoProps) {
  const styles = useStyles(createStyles);

  return (
    <HojaInferior
      visible={visible}
      alCerrar={alCerrar}
      titulo={TITULO_DIA_LLENO}
      pie={<Button variant="ghost" label="Elegir otro día" onPress={alCerrar} fullWidth />}
    >
      <View style={styles.contenido}>
        <Text color="textMuted">{MENSAJE_DIA_LLENO}</Text>
        {opciones.length > 0 && (
          <View style={styles.opciones}>
            {opciones.map((opcion) => (
              <OpcionMenu
                key={opcion.dia}
                icono={opcion.antes ? CalendarMinus : CalendarPlus}
                titulo={opcion.titulo}
                descripcion={opcion.texto}
                onPress={() => alElegir(opcion.dia)}
                navega={false}
              />
            ))}
          </View>
        )}
      </View>
    </HojaInferior>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    contenido: { gap: theme.spacing.lg },
    opciones: { gap: theme.spacing.xs },
  });
