import { StyleSheet, View } from 'react-native';
import { BarraCarrito, useCarrito } from '@/features/carrito';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { EstadoCatalogo, PieCatalogo } from '../components/AvisosCatalogo';
import { CabeceraBienvenida } from '../components/CabeceraBienvenida';
import { FiltrosCarta } from '../components/FiltrosCarta';
import { SeccionCarta } from '../components/SeccionCarta';
import { useCarta } from '../hooks/useCarta';
import { tituloSeccion } from '../textos';

/**
 * El catálogo como carta: agrupado por tipo, con la descripción a la vista y el precio a la derecha. Las secciones
 * llegan agrupadas, ordenadas y filtradas por el back: se dibujan como vienen. Arriba, la bienvenida con el
 * buscador, el tipo y el gusto
 */
export function CatalogoCartaScreen() {
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';
  const carta = useCarta();
  const { filtros } = carta;
  const refresco = useRefrescar(carta.refrescar);
  const carrito = useCarrito();
  const listo = !carta.cargando && !carta.error;

  return (
    <ScreenContainer width="completo" refreshControl={refresco.control} pie={<BarraCarrito />}>
      <View style={[styles.hoja, enCompu && styles.hojaCompu]}>
        <CabeceraBienvenida>
          <FiltrosCarta filtros={filtros} />
        </CabeceraBienvenida>
        <EstadoCatalogo
          cargando={carta.cargando}
          refrescando={refresco.refrescando}
          error={carta.error}
          reintentar={carta.reintentar}
          vacio={listo && carta.secciones.length === 0}
          buscando={filtros.buscando}
          hayFiltros={filtros.hayFiltros}
          limpiar={filtros.limpiar}
        />
        {carta.secciones.map(({ tipo, productos }) => (
          <SeccionCarta
            key={tipo?._id ?? 'sin-tipo'}
            titulo={tituloSeccion(tipo, carta.secciones.length === 1)}
            productos={productos}
            alAbrir={carta.abrir}
            grande={enCompu}
            cantidadDe={carrito.cantidadDe}
            alCambiarCantidad={carrito.cambiarCantidad}
            maxUnidades={carrito.maxUnidades}
          />
        ))}
        <PieCatalogo />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Una sola columna, centrada: en la compu cambian los números (el ancho), no el orden
    hoja: { width: '100%', maxWidth: theme.sizes.cartaMax, alignSelf: 'center' },
    // En la compu ocupa el 80% de la ventana (en una columna angosta quedaba perdida), directo sobre el
    // fondo de la página: sin tarjeta, que se veía como una caja adentro de otra
    hojaCompu: { width: theme.sizes.cartaCompu, maxWidth: '100%' },
  });
