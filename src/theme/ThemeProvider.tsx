import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { cambiarEstiloTipografia } from './store/estiloTipografiaSlice';
import { cambiarPreferencia, type PreferenciaTema } from './store/preferenciaTemaSlice';
import { crearTipografia } from './themes/base';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
import type { EstiloTipografia, ModoTema, Theme } from './types';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const esquemaSistema = useColorScheme();
  const preferencia = useAppSelector((s) => s.preferenciaTema.preferencia);
  const estiloTipografia = useAppSelector((s) => s.estiloTipografia.estilo);

  const modo: ModoTema =
    preferencia === 'sistema' ? (esquemaSistema === 'dark' ? 'dark' : 'light') : preferencia === 'oscuro' ? 'dark' : 'light';

  // Avisa al sistema para que el teclado, los diálogos y la barra de estado sigan al tema elegido
  useEffect(() => {
    if (typeof Appearance.setColorScheme !== 'function') return;
    Appearance.setColorScheme(preferencia === 'sistema' ? 'unspecified' : preferencia === 'oscuro' ? 'dark' : 'light');
  }, [preferencia]);

  // Los colores salen del modo y las fuentes del estilo elegido. Un objeto nuevo solo cuando cambia alguno
  const theme = useMemo<Theme>(
    () => ({ ...(modo === 'dark' ? darkTheme : lightTheme), ...crearTipografia(estiloTipografia) }),
    [modo, estiloTipografia]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** El theme activo. Es la única forma de acceder a colores, espaciados y tipografía */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme tiene que usarse dentro de <ThemeProvider>');
  return theme;
}

/** Modo activo y preferencia del usuario (sistema, claro u oscuro) */
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

/** Estilo de tipografía (clásica, artesanal o delicada) y cómo cambiarlo. Se guarda solo */
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
