import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import { EtiquetasVistaPrevia } from '@/features/catalogo';

// El HTML de todas las páginas de la web, solo al exportarla (corre en Node, no en el navegador ni en la APK).
// Lleva la vista previa del link de WhatsApp: desde el SDK 58, lo que pone <Head> ya no entra en este HTML.
// headNodes (estilos, fuentes) y bodyNodes (el JS que hidrata la página) los arma Expo: sin ellos la web no anda
export default function RootHtml({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="es" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <EtiquetasVistaPrevia />
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
