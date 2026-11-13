import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type RefreshControlProps, type ViewInstance } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ArrowDown } from 'lucide-react-native';
import { Cargando, Icon, Text } from '@/shared/ui/atoms';
import { useStyles, useTheme, type Theme } from '@/theme';

// Cuánto baja el aviso (ya con la resistencia) para que al soltar se actualice
const UMBRAL = 72;
// Hasta dónde baja aunque se siga tirando
const TOPE = 112;
// El dedo recorre el doble de lo que baja el aviso: se siente que tira de algo
const RESISTENCIA = 0.5;
// Lo que se mueve el dedo antes de decidir si tira para abajo o desliza de costado (el carrusel de fotos)
const TOLERANCIA = 8;
const VUELTA_MS = 200;

type Estado = 'tirando' | 'listo';

/** Si algún scroll entre lo que se tocó y el control ya está bajado: entonces el gesto es subir, no refrescar */
function hayAlgoBajado(desde: EventTarget | null, hasta: HTMLElement): boolean {
  for (let nodo = desde instanceof Element ? desde : null; nodo && nodo !== hasta; nodo = nodo.parentElement) {
    if (nodo.scrollTop > 0) return true;
  }
  return false;
}

/**
 * Tirar para abajo en la web. react-native-web trae un RefreshControl que no hace nada (y el navegador no recarga
 * solo: el scroll es el del ScrollView, no el de la página), así que el gesto se arma acá con los toques del
 * dedo: con el scroll arriba de todo, tirar baja un aviso y, pasado el umbral, al soltar se llama a `onRefresh`.
 * En la compu no hay dedo: está el botón de recargar del navegador
 */
export function ControlRefresco({ refreshing, onRefresh, enabled = true, style, children }: RefreshControlProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const caja = useRef<ViewInstance>(null);
  const tirado = useSharedValue(0);
  const [estado, setEstado] = useState<Estado>('tirando');
  // Si el dedo está tirando ahora. El aviso queda en la página aunque no se vea (opacidad 0): sin esto, el lector de
  // pantalla leía «Tirá para actualizar» al final de cada página
  const [tirandoAhora, setTirandoAhora] = useState(false);
  const aLaVista = tirandoAhora || Boolean(refreshing);

  // Los listeners del DOM se ponen una sola vez: leen de acá lo último que llegó por props
  const ultimo = useRef({ refreshing, onRefresh, enabled });
  useEffect(() => {
    ultimo.current = { refreshing, onRefresh, enabled };
  });

  // Mientras actualiza, el aviso se queda a la vista con la carga; cuando termina, se va
  useEffect(() => {
    tirado.value = withTiming(refreshing ? UMBRAL : 0, { duration: VUELTA_MS });
  }, [refreshing, tirado]);

  useEffect(() => {
    // En react-native-web, la ref de un View es el elemento del DOM
    const nodo = caja.current as unknown as HTMLElement | null;
    if (!nodo) return;

    let inicio: { x: number; y: number } | null = null;
    let tirando = false;
    let pasoElUmbral = false;

    const terminar = (actualizar: boolean) => {
      const estabaTirando = tirando;
      inicio = null;
      tirando = false;
      pasoElUmbral = false;
      if (!estabaTirando) return;
      setTirandoAhora(false);
      if (actualizar) ultimo.current.onRefresh?.();
      // Si se actualiza, se queda en el umbral hasta que llegan los datos (lo baja el efecto de `refreshing`)
      tirado.value = withTiming(actualizar ? UMBRAL : 0, { duration: VUELTA_MS });
    };

    const alTocar = (evento: TouchEvent) => {
      inicio = null;
      const { refreshing: actualizando, enabled: habilitado } = ultimo.current;
      if (actualizando || !habilitado || evento.touches.length !== 1) return;
      if (hayAlgoBajado(evento.target, nodo)) return;
      inicio = { x: evento.touches[0].clientX, y: evento.touches[0].clientY };
    };

    const alMover = (evento: TouchEvent) => {
      if (!inicio) return;
      const dx = evento.touches[0].clientX - inicio.x;
      const dy = evento.touches[0].clientY - inicio.y;

      if (!tirando) {
        if (Math.abs(dx) < TOLERANCIA && Math.abs(dy) < TOLERANCIA) return;
        // Para arriba o de costado: es el scroll o el carrusel, no un tirón
        if (dy <= 0 || Math.abs(dx) > dy) {
          inicio = null;
          return;
        }
        tirando = true;
        setEstado('tirando');
        setTirandoAhora(true);
      }

      // Sin esto, el navegador mueve el scroll (o lo estira, en el iPhone) a la par del aviso
      if (evento.cancelable) evento.preventDefault();
      const bajada = Math.min(TOPE, Math.max(0, dy - TOLERANCIA) * RESISTENCIA);
      tirado.value = bajada;
      const pasa = bajada >= UMBRAL;
      if (pasa !== pasoElUmbral) {
        pasoElUmbral = pasa;
        setEstado(pasa ? 'listo' : 'tirando');
      }
    };

    const alSoltar = () => terminar(pasoElUmbral);
    const alCancelar = () => terminar(false);

    nodo.addEventListener('touchstart', alTocar, { passive: true });
    // No pasivo: es el único que puede frenar el scroll del navegador
    nodo.addEventListener('touchmove', alMover, { passive: false });
    nodo.addEventListener('touchend', alSoltar);
    nodo.addEventListener('touchcancel', alCancelar);
    return () => {
      nodo.removeEventListener('touchstart', alTocar);
      nodo.removeEventListener('touchmove', alMover);
      nodo.removeEventListener('touchend', alSoltar);
      nodo.removeEventListener('touchcancel', alCancelar);
    };
  }, [tirado]);

  // En el umbral, el aviso queda a `reposo` del borde de arriba; antes, sube a la par del dedo hasta esconderse
  const reposo = theme.spacing.lg;
  const bajar = useAnimatedStyle(() => ({
    opacity: interpolate(tirado.value, [0, UMBRAL / 2], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: tirado.value - UMBRAL + reposo }],
  }));
  // La flecha se da vuelta cuando ya alcanza con soltar
  const girar = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(tirado.value, [UMBRAL * 0.6, UMBRAL], [0, 180], Extrapolation.CLAMP)}deg` }],
  }));

  return (
    <View ref={caja} style={[styles.caja, style]}>
      {children}
      <Animated.View style={[styles.carril, bajar]} aria-hidden={!aLaVista}>
        <View style={styles.aviso}>
          {refreshing ? (
            <Cargando tamano="chico" mensaje="Actualizando" />
          ) : (
            <>
              <Animated.View style={girar}>
                <Icon icon={ArrowDown} size="sm" color="primary" />
              </Animated.View>
              <Text variant="label">{estado === 'listo' ? 'Soltá para actualizar' : 'Tirá para actualizar'}</Text>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Recorta el aviso mientras está escondido arriba
    caja: { overflow: 'hidden' },
    // De lado a lado, para centrar el aviso; no ataja los toques: lo de abajo se sigue pudiendo tocar
    carril: {
      position: 'absolute',
      top: theme.spacing.none,
      left: theme.spacing.none,
      right: theme.spacing.none,
      alignItems: 'center',
      pointerEvents: 'none',
    },
    aviso: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      minHeight: theme.sizes.touchMin,
      borderRadius: theme.radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      boxShadow: `0 ${theme.spacing.xxs}px ${theme.spacing.sm}px ${theme.colors.shadow}`,
    },
  });
