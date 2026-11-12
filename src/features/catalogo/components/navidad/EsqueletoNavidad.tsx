import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarraCarrito, useCarrito } from '@/features/carrito';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { ScreenContainer, Text } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { EstadoCatalogo, PieCatalogo } from '@/features/catalogo/components/AvisosCatalogo';
import { FilaCarta } from '@/features/catalogo/components/FilaCarta';
import { FiltrosCarta } from '@/features/catalogo/components/FiltrosCarta';
import { useCarta } from '@/features/catalogo/hooks/useCarta';
import { TEXTOS_NAVIDAD, tituloSeccion } from '@/features/catalogo/textos';
import { Entrada } from './adornos';
import { EtiquetaNavidad } from './EtiquetaNavidad';
import { TarjetaNavidad } from './TarjetaNavidad';

interface EsqueletoNavidadProps {
  /** Lo de arriba, adentro de la columna: la marca, el adorno y el saludo */
  cabecera: ReactNode;
  /** Algo antes de la columna, de borde a borde de la pantalla (el cielo de la Navidad de noche) */
  encima?: ReactNode;
  /** Un fondo con dibujo, fijo detrás de toda la página (el patrón de Navidad) */
  fondo?: ReactNode;
  /** El título de cada sección */
  seccion: (titulo: string, cantidad: number, indice: number) => ReactNode;
  /** Cada producto en su tarjeta (`TarjetaNavidad`). Sin esto, las filas van sueltas, como en la carta */
  tarjetas?: boolean;
  /** El dibujo del catálogo vacío */
  vacio: ReactNode;
  /** El dibujo del pie */
  pie: ReactNode;
}

/**
 * Lo que comparten los dos catálogos de Navidad (de día y de noche): la carta (useCarta, con los filtros adentro), el
 * carrito, el refresco, los avisos (cargando, error, vacío) y el pie. Los productos van como en la carta, en filas
 * (`FilaCarta`: la foto, el nombre con el precio y los puntitos, la descripción y el «+»): cada uno en su tarjeta
 * (`TarjetaNavidad`, sólida: el patrón se ve entre una y otra) o, sin `tarjetas`, sueltos sobre
 * el patrón; entran de a uno al cargar. Una sola columna, del ancho de la
 * carta. La etiqueta del dueño va con `EtiquetaNavidad` (la cinta roja con el acebo), no con el sello dorado. Cada
 * catálogo pone solo cómo se ve: su cabecera, el título de las secciones y los dibujos
 */
export function EsqueletoNavidad({ cabecera, encima, fondo, seccion, tarjetas = false, vacio, pie }: EsqueletoNavidadProps) {
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';
  const carta = useCarta();
  const { filtros } = carta;
  const refresco = useRefrescar(carta.refrescar);
  const carrito = useCarrito();
  const listo = !carta.cargando && !carta.error;

  return (
    <ScreenContainer width="completo" refreshControl={refresco.control} pie={<BarraCarrito />} fondo={fondo} llenarAlto>
      {encima}
      <View style={[styles.columna, enCompu && styles.columnaCompu]}>
        {cabecera}
        <FiltrosCarta filtros={filtros} />
        <EstadoCatalogo
          cargando={carta.cargando}
          refrescando={refresco.refrescando}
          error={carta.error}
          reintentar={carta.reintentar}
          vacio={listo && carta.secciones.length === 0}
          buscando={filtros.buscando}
          hayFiltros={filtros.hayFiltros}
          limpiar={filtros.limpiar}
          vacioDeTemporada={{ adorno: vacio, ...TEXTOS_NAVIDAD.vacio }}
        />
        {carta.secciones.map(({ tipo, productos }, indice) => (
          <View key={tipo?._id ?? 'sin-tipo'} style={styles.seccion}>
            {seccion(tituloSeccion(tipo, carta.secciones.length === 1, TEXTOS_NAVIDAD.seccionUnica), productos.length, indice)}
            <View style={tarjetas && [styles.tarjetas, enCompu && styles.tarjetasCompu]}>
              {productos.map((producto, fila) => {
                const contenido = (
                  <FilaCarta
                    producto={producto}
                    alAbrir={carta.abrir}
                    grande={enCompu}
                    cantidad={carrito.cantidadDe(producto._id)}
                    alCambiarCantidad={carrito.cambiarCantidad}
                    maxUnidades={carrito.maxUnidades}
                    separada={!tarjetas && fila > 0}
                    sello={(texto) => <EtiquetaNavidad texto={texto} />}
                  />
                );
                return (
                  <Entrada key={producto._id} indice={fila}>
                    {tarjetas ? (
                      <TarjetaNavidad indice={fila}>
                        {contenido}
                      </TarjetaNavidad>
                    ) : (
                      contenido
                    )}
                  </Entrada>
                );
              })}
            </View>
          </View>
        ))}
        <PieCatalogo
          adorno={
            <View style={styles.pie}>
              {pie}
              <Text color="textMuted" align="center">
                {TEXTOS_NAVIDAD.pie}
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Una sola columna, como la carta: en la compu, el 80% de la ventana
    columna: { flexGrow: 1, width: '100%', maxWidth: theme.sizes.cartaMax, alignSelf: 'center', gap: theme.spacing.lg },
    columnaCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
    seccion: { gap: theme.spacing.md, paddingTop: theme.spacing.lg },
    // Las tarjetas, separadas entre sí: entre una y otra se ve el patrón
    tarjetas: { gap: theme.spacing.md },
    tarjetasCompu: { gap: theme.spacing.lg },
    pie: { alignItems: 'center', gap: theme.spacing.sm },
  });
