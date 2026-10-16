import { StyleSheet, View } from 'react-native';
import { BarraCarrito, useCarrito } from '@/features/carrito';
import { useRefrescar } from '@/shared/hooks';
import { ScreenContainer } from '@/shared/ui/atoms';
import { useStyles, type Theme } from '@/theme';
import { EstadoCatalogo, FinDeLista, PieCatalogo } from '../components/AvisosCatalogo';
import { CabeceraVidriera } from '../components/CabeceraVidriera';
import { FiltrosVidriera } from '../components/FiltrosVidriera';
import { GrillaVidriera } from '../components/GrillaVidriera';
import { useCatalogo } from '../hooks/useCatalogo';

// De a 20: con muchas fotos, la primera página llega antes
const POR_PAGINA = 20;

/** El catálogo como vidriera: una grilla de fotos grandes, con buscador y filtro por gusto */
export function CatalogoVidrieraScreen() {
  const styles = useStyles(createStyles);
  const catalogo = useCatalogo(POR_PAGINA);
  const { filtros } = catalogo;
  const refresco = useRefrescar(catalogo.refrescar);
  const carrito = useCarrito();
  const listo = !catalogo.cargando && !catalogo.error;

  return (
    <ScreenContainer refreshControl={refresco.control} alLlegarAlFinal={catalogo.cargarMas} pie={<BarraCarrito />}>
      <View style={styles.contenido}>
        <CabeceraVidriera />
        <FiltrosVidriera
          texto={filtros.texto}
          setTexto={filtros.setTexto}
          gustos={filtros.gustos}
          gusto={filtros.gusto}
          setGusto={filtros.setGusto}
          total={listo ? catalogo.total : null}
        />
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
        <GrillaVidriera
          productos={catalogo.productos}
          alAbrir={catalogo.abrir}
          cantidadDe={carrito.cantidadDe}
          alCambiarCantidad={carrito.cambiarCantidad}
          maxUnidades={carrito.maxUnidades}
        />
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
    contenido: { gap: theme.spacing.xl },
  });
