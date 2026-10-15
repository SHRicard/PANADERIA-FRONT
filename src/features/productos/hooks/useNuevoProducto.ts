import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useAppDispatch } from '@/store';
import { useCrearProductoMutation } from '../api/productosApi';
import { aDatosProducto, FORMULARIO_VACIO } from '../formulario';
import { productoFormSchema } from '../schemas';
import { subirFotos } from '../store/subidaFotosSlice';
import type { ProductoFormulario } from '../types';
import { useCategorias } from './useCategorias';
import { useFotosElegidas } from './useFotosElegidas';

export function useNuevoProducto() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [crearProducto] = useCrearProductoMutation();
  const fotos = useFotosElegidas();
  const categorias = useCategorias();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProductoFormulario>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: FORMULARIO_VACIO,
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/productos'));

  // Primero el producto solo con los datos (rápido); las fotos van después, por la cola
  const enviar = form.handleSubmit(async (valores) => {
    setError(null);
    try {
      const producto = await crearProducto(aDatosProducto(valores)).unwrap();
      // Sin esperar: suben en segundo plano y siguen aunque el dueño cambie de pantalla
      if (fotos.fotos.length > 0) void dispatch(subirFotos({ productoId: producto._id, fotos: fotos.fotos }));
      volver();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  return {
    categorias,
    control: form.control,
    enfocar: form.setFocus,
    enviar,
    enviando: form.formState.isSubmitting,
    error,
    fotos,
  };
}
