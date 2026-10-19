import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useBorrarFotoMutation } from '@/features/productos';
import { useBorrarPromoMutation } from '@/features/promos';
import { mensajeDeError, type ApiError } from '@/services/api';
import { useAppDispatch } from '@/store';
import { almacenamientoApi, useListarArchivosInfiniteQuery } from '../api/almacenamientoApi';
import { claveArchivo, confirmacionBorrado, type FiltroArchivos } from '../textos';
import type { ArchivoAlmacenado } from '../types';

/**
 * Lo que más ocupa en Cloudinary, para elegir qué borrar (Más → Memoria). Borra con las mutations de
 * productos y promos (así se actualizan también sus pantallas) y después vuelve a pedir la lista
 */
export function useArchivos() {
  const dispatch = useAppDispatch();
  const [filtro, setFiltro] = useState<FiltroArchivos>('todo');
  // Se vuelve a pedir cada vez que se abre: pudo haber borrado o subido algo desde otra pantalla
  const consulta = useListarArchivosInfiniteQuery(filtro === 'todo' ? undefined : filtro, { refetchOnMountOrArgChange: true });
  const paginas = consulta.currentData?.pages;
  const archivos = useMemo(() => paginas?.flatMap((pagina) => pagina.archivos) ?? [], [paginas]);

  const [borrarFoto] = useBorrarFotoMutation();
  const [borrarPromo] = useBorrarPromoMutation();
  const [borrando, setBorrando] = useState<string | null>(null);
  const [errorBorrar, setErrorBorrar] = useState<string | null>(null);

  const borrar = async (archivo: ArchivoAlmacenado) => {
    setErrorBorrar(null);
    setBorrando(claveArchivo(archivo));
    try {
      if (archivo.origen === 'producto') {
        await borrarFoto({ productoId: archivo.productoId, imagenId: archivo.imagenId }).unwrap();
      } else {
        await borrarPromo(archivo.promoId).unwrap();
      }
      dispatch(almacenamientoApi.util.invalidateTags(['ArchivoAlmacenado']));
    } catch (e) {
      // 404: ya lo había borrado (por ejemplo, desde otra pantalla). No es una falla: se saca de la lista igual
      if ((e as Partial<ApiError>).status === 404) dispatch(almacenamientoApi.util.invalidateTags(['ArchivoAlmacenado']));
      else setErrorBorrar(mensajeDeError(e));
    } finally {
      setBorrando(null);
    }
  };

  return {
    archivos,
    /** Cuántos hay con este filtro y cuánto ocupan, contando los que todavía no se cargaron */
    total: paginas?.[0]?.totalArchivos ?? 0,
    totalBytes: paginas?.[0]?.totalBytes ?? 0,
    cargando: !paginas && consulta.isFetching,
    error: consulta.isError && !paginas ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    refrescar: async () => {
      await consulta.refetch();
    },
    cargandoMas: consulta.isFetchingNextPage,
    cargarMas: () => {
      if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
    },
    filtro,
    setFiltro,
    /** La clave (claveArchivo) del que se está borrando */
    borrando,
    errorBorrar,
    // Se confirma: no se puede deshacer
    pedirBorrar: (archivo: ArchivoAlmacenado) => {
      const { titulo, mensaje } = confirmacionBorrado(archivo);
      Alert.alert(titulo, mensaje, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: () => void borrar(archivo) },
      ]);
    },
  };
}
