import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Heart, Sparkles, Star } from 'lucide-react-native';
import { Alert, Button, CampoTexto, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { useAutorrecomendar } from '../hooks/useAutorrecomendar';
import type { FormularioRecomendacion as Formulario } from '../types';
import { ElegirEstrellas } from './ElegirEstrellas';
import { IdeasRecomendacion } from './IdeasRecomendacion';

interface FormularioRecomendacionProps {
  form: UseFormReturn<Formulario>;
  enviar: () => void;
  enviando: boolean;
  error: string | null;
  /** Ya dejó la suya: en vez del formulario, el «gracias» */
  enviada: boolean;
  /** Un dibujo a la izquierda del título (los catálogos de Navidad ponen un muñequito) */
  dibujo?: ReactNode;
  /** De Navidad: se vota con galletitas de jengibre en lugar de estrellas */
  navidad?: boolean;
}

/** «¿Es tu ganador?»: las estrellas (de Navidad, galletitas de jengibre) y, si quiere, qué le pareció y su nombre. Sin cuenta */
export function FormularioRecomendacion({ form, enviar, enviando, error, enviada, dibujo, navidad = false }: FormularioRecomendacionProps) {
  const styles = useStyles(createStyles);
  const ideas = useAutorrecomendar(form);

  if (enviada) {
    return (
      <View style={styles.gracias} accessibilityLiveRegion="polite">
        <Icon icon={Heart} size="xl" color="primary" relleno="lleno" />
        <Text variant="title" align="center">
          ¡Gracias por tu voto!
        </Text>
        <Text color="textMuted" align="center">
          Nos alegraste el día. Tu recomendación ya está en la lista, primera de todas.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.formulario}>
      <View style={styles.titulo}>
        <View style={styles.encabezado}>
          {dibujo}
          <View style={styles.flexible}>
            <Text variant="overline" color="primary">
              ¿Ya lo probaste?
            </Text>
            <Text variant="heading">¿Es tu ganador?</Text>
          </View>
        </View>
        <Text color="textMuted">
          Dejale tus {navidad ? 'galletitas' : 'estrellas'} y contanos qué te pareció. Cada voto nos llena el corazón y ayuda
          a otros a elegir.
        </Text>
      </View>
      <Controller
        control={form.control}
        name="puntaje"
        render={({ field: { value, onChange }, fieldState }) => (
          <ElegirEstrellas valor={value} alCambiar={onChange} error={fieldState.error?.message} navidad={navidad} />
        )}
      />
      <CampoTexto
        control={form.control}
        name="texto"
        label="¿Qué te pareció?"
        placeholder="La masa, el relleno, con qué lo acompañaste…"
        helper="Opcional. ¿Sin ideas? Tocá «Autorrecomendar»."
        autoCapitalize="sentences"
        maxLength={300}
        multiline
      />
      {/* Ideas para el campo de arriba: elegir una lo llena, y después se puede cambiar */}
      {ideas.abierta ? (
        <IdeasRecomendacion
          ideas={ideas.ideas}
          alUsar={ideas.usar}
          alPedirOtras={ideas.otrasIdeas}
          alCerrar={ideas.cerrar}
        />
      ) : (
        <View style={styles.autorrecomendar}>
          <Button variant="secondary" size="sm" icon={Sparkles} label="Autorrecomendar" onPress={ideas.autorrecomendar} />
        </View>
      )}
      <CampoTexto
        control={form.control}
        name="autor"
        label="Tu nombre"
        placeholder="María"
        helper="Opcional. Sale arriba de lo que escribiste."
        autoCapitalize="words"
        autoComplete="name"
        maxLength={60}
        returnKeyType="send"
        submitBehavior="submit"
        onSubmitEditing={enviar}
      />
      {error && <Alert tone="danger" message={error} />}
      <Button label={navidad ? 'Dejar mis galletitas' : 'Dejar mis estrellas'} icon={Star} onPress={enviar} loading={enviando} fullWidth />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    formulario: { gap: theme.spacing.md },
    titulo: { gap: theme.spacing.xs },
    encabezado: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    flexible: { flexShrink: 1, gap: theme.spacing.xs },
    autorrecomendar: { alignItems: 'flex-start' },
    gracias: { alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xl },
  });
