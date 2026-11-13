import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { cambiarEstiloTipografia } from './store/estiloTipografiaSlice';
import { cambiarPreferencia, type PreferenciaTema } from './store/preferenciaTemaSlice';
import { crearTipografia } from './themes/base';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
import type { TemaTemporada } from './themes/temporada';
import type { EstiloTipografia, ModoTema, Theme } from './types';

const ThemeContext = createContext<Theme | null>(null);
// Lo que un tema de temporada dibuja detrás de cada pantalla (la nieve de Navidad). Fuera de ese tema, nada
const FondoTemporadaContext = createContext<ReactNode>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preferencia = useAppSelector((s) => s.preferenciaTema.preferencia);
  const estiloTipografia = useAppSelector((s) => s.estiloTipografia.estilo);

  // Claro u oscuro, el que eligió el dueño: no sigue al celular ni a la compu de cada uno (en la web, lo trae el back)
  const modo: ModoTema = preferencia === 'oscuro' ? 'dark' : 'light';

  // Avisa al sistema para que el teclado, los diálogos y la barra de estado sigan al tema elegido
  useEffect(() => {
    if (typeof Appearance.setColorScheme !== 'function') return;
    Appearance.setColorScheme(preferencia === 'oscuro' ? 'dark' : 'light');
  }, [preferencia]);

  // Los colores salen del modo y las fuentes del estilo elegido. Un objeto nuevo solo cuando cambia alguno
  const theme = useMemo<Theme>(
    () => ({ ...(modo === 'dark' ? darkTheme : lightTheme), ...crearTipografia(estiloTipografia) }),
    [modo, estiloTipografia]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

interface TemaAnidadoProps {
  /** El tema de temporada que se aplica adentro, en el modo de afuera (claro u oscuro). null: el de afuera, tal cual */
  tema: TemaTemporada | null;
  /**
   * Algo que va detrás del contenido de cada pantalla mientras hay `tema` (la nieve de Navidad): lo pone
   * `ScreenContainer` en su fondo fijo, entre el color de la página y lo que se desliza. Así cae detrás de los textos y
   * de las hojas que se abren encima, nunca por delante
   */
  fondo?: ReactNode;
  children: ReactNode;
}

/**
 * Otro tema para una parte de la app (el catálogo de Navidad de la web), con los mismos nombres semánticos: lo de
 * adentro lo lee con `useTheme()` como siempre y se pinta solo (colores, fuentes y esquinas). Siempre monta el mismo
 * Provider, también con `tema` en null: así lo que va adentro (un Stack) no cambia de lugar en el árbol al cambiar
 * de tema
 */
export function TemaAnidado({ tema, fondo = null, children }: TemaAnidadoProps) {
  const afuera = useTheme();

  const theme = useMemo<Theme>(() => {
    if (!tema) return afuera;
    return {
      ...afuera,
      colors: afuera.mode === 'dark' ? tema.oscuro : tema.claro,
      radius: tema.radius,
      ...crearTipografia(tema.fuentes),
    };
  }, [afuera, tema]);

  return (
    <ThemeContext.Provider value={theme}>
      <FondoTemporadaContext.Provider value={tema ? fondo : null}>{children}</FondoTemporadaContext.Provider>
    </ThemeContext.Provider>
  );
}

/** Lo que el tema de temporada pone detrás de cada pantalla (ver `TemaAnidado`). null fuera de un tema de temporada */
export function useFondoTemporada(): ReactNode {
  return useContext(FondoTemporadaContext);
}

/** El theme activo. Es la única forma de acceder a colores, espaciados y tipografía */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme tiene que usarse dentro de <ThemeProvider>');
  return theme;
}

/** Modo activo y preferencia (claro u oscuro) */
export function useThemeMode(): {
  modo: ModoTema;
  preferencia: PreferenciaTema;
  cambiarPreferencia: (preferencia: PreferenciaTema) => void;
} {
  const { mode } = useTheme();
  const preferencia = useAppSelector((s) => s.preferenciaTema.preferencia);
  const dispatch = useAppDispatch();
  return { modo: mode, preferencia, cambiarPreferencia: (nueva) => dispatch(cambiarPreferencia(nueva)) };
}

/** Estilo de tipografía y cómo cambiarlo (hoy hay uno solo: clásica). Se guarda solo */
export function useTipografia(): { estilo: EstiloTipografia; cambiarEstilo: (estilo: EstiloTipografia) => void } {
  const estilo = useAppSelector((s) => s.estiloTipografia.estilo);
  const dispatch = useAppDispatch();
  return { estilo, cambiarEstilo: (nuevo) => dispatch(cambiarEstiloTipografia(nuevo)) };
}

/**
 * Estilos derivados del theme, recalculados solo cuando cambia el tema.
 * `crear` va fuera del componente (para que sea siempre la misma función) y devuelve un `StyleSheet.create`.
 */
export function useStyles<T>(crear: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => crear(theme), [crear, theme]);
}
