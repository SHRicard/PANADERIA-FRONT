import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarraCarrito, useCarrito } from '@/features/carrito';
import { useBreakpoint, useRefrescar } from '@/shared/hooks';
import { ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { EstadoCatalogo, FinDeLista, PieCatalogo } from '../components/AvisosCatalogo';
import { CabeceraBienvenida } from '../components/CabeceraBienvenida';
import { FiltrosCarta } from '../components/FiltrosCarta';
import { SeccionCarta } from '../components/SeccionCarta';
import { TODO_EL_CATALOGO } from '../api/catalogoApi';
import { useCatalogo } from '../hooks/useCatalogo';

/**
 * El catálogo como carta: agrupado por gusto, con la descripción a la vista y el precio a la derecha.
 * Arriba, la bienvenida con el buscador y el gusto (filtra: el back trae solo ese gusto)
 */
export function CatalogoCartaScreen() {
  const styles = useStyles(createStyles);
  const enCompu = useBreakpoint() === 'compu';
  // Todo de una: la carta se lee entera, agrupada por gusto
  const catalogo = useCatalogo(TODO_EL_CATALOGO);
  const { filtros } = catalogo;
  const refresco = useRefrescar(catalogo.refrescar);
  const carrito = useCarrito();
  const listo = !catalogo.cargando && !catalogo.error;

  const grupos = useMemo(
    () =>
      filtros.gustos
        .map(({ nombre }) => ({ gusto: nombre, productos: catalogo.productos.filter((p) => p.categoria === nombre) }))
        .filter(({ productos }) => productos.length > 0),
    [filtros.gustos, catalogo.productos],
  );

  return (
    <ScreenContainer
      width="completo"
      refreshControl={refresco.control}
      alLlegarAlFinal={catalogo.cargarMas}
      pie={<BarraCarrito />}
    >
      <View style={[styles.hoja, enCompu && styles.hojaCompu]}>
        <CabeceraBienvenida>
          <FiltrosCarta
            texto={filtros.texto}
            setTexto={filtros.setTexto}
            gustos={filtros.gustos}
            gusto={filtros.gusto}
            setGusto={filtros.setGusto}
          />
        </CabeceraBienvenida>
        <EstadoCatalogo
          cargando={catalogo.cargando}
          refrescando={refresco.refrescando}
          error={catalogo.error}
          reintentar={catalogo.reintentar}
          vacio={listo && catalogo.productos.length === 0}
          buscando={filtros.buscando}
          hayFiltros={filtros.hayFiltros}
          limpiar={filtros.limpiar}
        />
        {grupos.map(({ gusto, productos }) => (
          <SeccionCarta
            key={gusto}
            gusto={gusto}
            productos={productos}
            alAbrir={catalogo.abrir}
            grande={enCompu}
            cantidadDe={carrito.cantidadDe}
            alCambiarCantidad={carrito.cambiarCantidad}
            maxUnidades={carrito.maxUnidades}
          />
        ))}
        <FinDeLista
          cargandoMas={catalogo.cargandoMas}
          errorMas={catalogo.errorMas}
          hayMas={catalogo.hayMas}
          cargarMas={catalogo.cargarMas}
        />
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
