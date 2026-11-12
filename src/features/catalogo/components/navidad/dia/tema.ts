import { crearTemaTemporada } from '@/theme';

/**
 * Navidad de día (`dia-navidad`): la página crema con el rojo y el dorado; la vidriera, de un cacao cálido que se hace
 * más profundo hacia los bordes (`destacado` → `destacadoProfundo`), con la guirnalda de oropel dorado (acá `pino` y
 * `pinoOscuro` son champán y bronce) y foquitos cálidos (`luzAzul` es cobre). Playfair Display y Lato; esquinas
 * redondeadas. De noche, la página en un oscuro cálido neutro (cacao casi negro), el tono de la app
 */
export const TEMA_DIA_NAVIDAD = crearTemaTemporada({
  tipografia: 'clasica',
  radios: 'redondeados',
  claro: {
    background: 'guirnaldaCrema',
    surface: 'blanco',
    surfaceMuted: 'guirnaldaApagado',
    border: 'guirnaldaBorde',
    text: 'chocolate',
    textMuted: 'chocolateSuave',
    primary: 'rojoNavidad',
    primaryPressed: 'rojoNavidadPresionado',
    onPrimary: 'blanco',
    primarySoft: 'rojoNavidadSuave',
    accent: 'doradoAro',
    onAccent: 'chocolate',
    nieve: 'blanco',
    cinta: 'rojoNavidad',
    pino: 'oropelChampan',
    pinoOscuro: 'oropelBronce',
    luzAzul: 'luzCobre',
    destacado: 'vidriera',
    destacadoProfundo: 'vidrieraProfunda',
    onDestacado: 'guirnaldaCrema',
    resplandor: 'resplandorDorado',
    shadow: 'sombraChocolate',
  },
  oscuro: {
    background: 'guirnaldaNoche',
    surface: 'guirnaldaNocheSuperficie',
    surfaceMuted: 'guirnaldaNocheApagado',
    border: 'guirnaldaNocheBorde',
    text: 'guirnaldaNocheTinta',
    textMuted: 'guirnaldaNocheTintaSuave',
    primary: 'rojoNavidadNoche',
    primaryPressed: 'rojoNavidadNochePresionado',
    onPrimary: 'rojoNavidadNocheTinta',
    primarySoft: 'rojoNavidadNocheSuave',
    accent: 'doradoNoche',
    onAccent: 'doradoNocheTinta',
    nieve: 'blanco',
    cinta: 'rojoNavidadNoche',
    pino: 'oropelChampanNoche',
    pinoOscuro: 'oropelBronceNoche',
    luzAzul: 'luzCobreNoche',
    destacado: 'vidriera',
    destacadoProfundo: 'vidrieraProfunda',
    onDestacado: 'guirnaldaCrema',
    resplandor: 'resplandorDoradoNoche',
    shadow: 'sombraNegra',
  },
});
