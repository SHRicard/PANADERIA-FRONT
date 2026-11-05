import Head from 'expo-router/head';
import { config } from '@/config';
import { VISTA_PREVIA } from '../textos';

/**
 * Las etiquetas que leen WhatsApp (y los demás) para armar la vista previa del link: el logo, el título y la
 * descripción. Salen en el HTML prerenderizado (`web.output: "static"`), que es lo único que ve WhatsApp: no corre el
 * JS. También ponen el título de la pestaña. La imagen va con la URL entera de la web (`EXPO_PUBLIC_WEB_URL`, también
 * en Vercel): con una relativa, WhatsApp no la muestra
 */
export function VistaPreviaLink() {
  const imagen = `${config.webUrl}${VISTA_PREVIA.imagen}`;

  return (
    <Head>
      <title>{VISTA_PREVIA.titulo}</title>
      <meta name="description" content={VISTA_PREVIA.descripcion} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={VISTA_PREVIA.marca} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:title" content={VISTA_PREVIA.titulo} />
      <meta property="og:description" content={VISTA_PREVIA.descripcion} />
      <meta property="og:image" content={imagen} />
      <meta property="og:image:secure_url" content={imagen} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content={String(VISTA_PREVIA.imagenAncho)} />
      <meta property="og:image:height" content={String(VISTA_PREVIA.imagenAlto)} />
      <meta property="og:image:alt" content={VISTA_PREVIA.imagenTexto} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
