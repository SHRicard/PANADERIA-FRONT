import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { cambiarPreferencia, type PreferenciaTema } from './store/preferenciaTemaSlice';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
import type { ModoTema, Theme } from './types';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const esquemaSistema = useColorScheme();
  const preferencia = useAppSelector((s) => s.preferenciaTema.preferencia);

  const modo: ModoTema =
    preferencia === 'sistema' ? (esquemaSistema === 'dark' ? 'dark' : 'light') : preferencia === 'oscuro' ? 'dark' : 'light';

  // Avisa al sistema para que el teclado, los diálogos y la barra de estado sigan al tema elegido
  useEffect(() => {
    if (typeof Appearance.setColorScheme !== 'function') return;
    Appearance.setColorScheme(preferencia === 'sistema' ? 'unspecified' : preferencia === 'oscuro' ? 'dark' : 'light');
  }, [preferencia]);

  return <ThemeContext.Provider value={modo === 'dark' ? darkTheme : lightTheme}>{children}</ThemeContext.Provider>;
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

/**
 * Estilos derivados del theme, recalculados solo cuando cambia el tema.
 * `crear` va fuera del componente (para que sea siempre la misma función) y devuelve un `StyleSheet.create`.
 */
export function useStyles<T>(crear: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => crear(theme), [crear, theme]);
}
