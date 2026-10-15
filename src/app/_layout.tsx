import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
  type Theme as NavigationTheme,
} from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider, useTheme } from '@/theme';

// El corte entre las dos caras vive acá y en ningún otro lado:
// la web es la cara pública (catálogo), la APK es la del admin.
const esWeb = Platform.OS === 'web';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Navegacion />
      </ThemeProvider>
    </Provider>
  );
}

function Navegacion() {
  const theme = useTheme();
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  const temaNavegacion: NavigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };

  // Fondo de la ventana nativa: evita el destello blanco al abrir o cambiar de pantalla en modo oscuro
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  return (
    <NavigationThemeProvider value={temaNavegacion}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {/* Botones de Android (◀ ● ■): siguen al tema de la app y no al del sistema. La barra es
          transparente (enforceContrast: false en app.json), así que detrás se ve el fondo de la pantalla.
          Como en el StatusBar, `style` es el color de los botones: claros en el tema oscuro */}
      <NavigationBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
        <Stack.Protected guard={esWeb}>
          <Stack.Screen name="(publico)" />
        </Stack.Protected>

        {/* Login y gestión: nunca se montan en la web */}
        <Stack.Protected guard={!esWeb}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>

        {/* Diseño del sistema: solo en desarrollo, en las dos caras */}
        <Stack.Protected guard={__DEV__}>
          <Stack.Screen name="(dev)" options={{ headerShown: true, title: 'Diseño del sistema' }} />
        </Stack.Protected>
      </Stack>
    </NavigationThemeProvider>
  );
}
