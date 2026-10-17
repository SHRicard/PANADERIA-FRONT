import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { useBorrarPromoMutation, useCrearPromoMutation, useEditarPromoMutation, useListarPromosQuery } from '../api/promosApi';
import { formularioPromoSchema } from '../schemas';
import type { ArchivoPromo, CambiosPromo, FormularioPromo, Promo } from '../types';
import { useElegirArchivoPromo } from './useElegirArchivoPromo';

const VACIO: FormularioPromo = { titulo: '', texto: '' };

const inicial = (promo: Promo): FormularioPromo => ({ titulo: promo.titulo, texto: promo.texto ?? '' });

/**
 * El formulario de promos. Sin id, el alta: el archivo de la galería, el título y el texto. Con id, la edición: solo
 * el título y el texto (para otro archivo, otra promo) y borrarla. No hay GET de una sola: sale de la lista, que ya
 * está en la caché (se llega desde ahí)
 */
export function useFormularioPromo(id?: string) {
  const router = useRouter();
  const navigation = useNavigation();
  const esNueva = !id;
  const consulta = useListarPromosQuery(undefined, { skip: esNueva });
  const promo = esNueva ? undefined : consulta.data?.find(({ _id }) => _id === id);
  const [crearPromo, { isLoading: subiendo }] = useCrearPromoMutation();
  const [editarPromo, { isLoading: editando }] = useEditarPromoMutation();
  const [borrarPromo, { isLoading: borrando }] = useBorrarPromoMutation();
  const [archivo, setArchivo] = useState<ArchivoPromo | null>(null);
  // Al borrar, la promo sale de la lista antes de volver: así no se ve «ya no existe» mientras se va
  const [saliendo, setSaliendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eleccion = useElegirArchivoPromo((elegido) => {
    setArchivo(elegido);
    setError(null);
  });

  const valores = useMemo(() => (promo ? inicial(promo) : undefined), [promo]);
  const form = useForm<FormularioPromo>({
    resolver: zodResolver(formularioPromoSchema),
    defaultValues: VACIO,
    // En la edición se llena apenas está la promo. Si la caché cambia, no pisa lo que el dueño ya escribió
    values: valores,
    resetOptions: { keepDirtyValues: true },
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/promos'));
  // Subir un video puede tardar minutos: si mientras tanto el dueño se fue de la pantalla, no se lo mueve de donde está
  const volverSiSigueAca = () => {
    if (navigation.isFocused()) volver();
  };

  const enviar = form.handleSubmit(async ({ titulo, texto }) => {
    setError(null);
    try {
      if (esNueva) {
        if (!archivo) return;
        await crearPromo({ titulo, texto: texto || undefined, archivo }).unwrap();
        volverSiSigueAca();
        return;
      }
      if (!promo) return;
      // Solo lo que cambió. El texto vacío viaja en null: así el back lo borra
      const cambios: CambiosPromo = {};
      if (titulo !== promo.titulo) cambios.titulo = titulo;
      if (texto !== (promo.texto ?? '')) cambios.texto = texto || null;
      if (Object.keys(cambios).length === 0) {
        setError('No cambiaste nada.');
        return;
      }
      await editarPromo({ id: promo._id, cambios }).unwrap();
      volverSiSigueAca();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  const guardar = async () => {
    // Sin archivo no hay promo: se avisa antes que los errores de los campos
    if (esNueva && !archivo) {
      setError('Elegí la foto o el video de la promo.');
      return;
    }
    await enviar();
  };

  const confirmarBorrar = async (aBorrar: Promo) => {
    setError(null);
    setSaliendo(true);
    try {
      await borrarPromo(aBorrar._id).unwrap();
      volverSiSigueAca();
    } catch (e) {
      setSaliendo(false);
      setError(mensajeDeError(e));
    }
  };

  const borrar = () => {
    if (!promo) return;
    Alert.alert(`¿Borrar «${promo.titulo}»?`, 'Se borra también la foto o el video. No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => void confirmarBorrar(promo) },
    ]);
  };

  return {
    form,
    guardar,
    guardando: subiendo || editando,
    /** El alta tarda: el archivo pasa por el back y por Cloudinary */
    subiendo,
    error,
    archivo,
    elegirArchivo: () => void eleccion.elegir(),
    /** El archivo elegido no cumple los límites (un video muy largo, una foto muy pesada) */
    avisoArchivo: eleccion.aviso,
    promo,
    cargando: !esNueva && !promo && (consulta.isLoading || saliendo),
    /** Un id que no está en la lista: la borraron o el link es viejo */
    noExiste: !esNueva && !promo && !saliendo && consulta.isSuccess,
    errorCarga: consulta.isError && !consulta.data ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    borrar,
    borrando,
    volver,
  };
}
