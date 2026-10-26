import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useEditarProductoMutation } from '../api/productosApi';
import { aFormulario, cambiosDe, FORMULARIO_VACIO } from '../formulario';
import { productoFormSchema } from '../schemas';
import type { ProductoFormulario } from '../types';
import { useCategorias } from './useCategorias';
import { useFotosProducto } from './useFotosProducto';
import { useProductoGuardado } from './useProductoGuardado';
import { useTiposDeProducto } from './useTiposDeProducto';

export function useEditarProducto(id: string) {
  const router = useRouter();
  const { producto, cargando } = useProductoGuardado(id);
  const categorias = useCategorias();
  const tipos = useTiposDeProducto();
  const [editarProducto] = useEditarProductoMutation();
  const fotos = useFotosProducto(producto);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductoFormulario>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: FORMULARIO_VACIO,
    // Se llena con el producto apenas está. Si la caché cambia (ej.: terminó de subir una foto),
    // no pisa lo que el dueño ya escribió
    values: producto ? aFormulario(producto) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/productos'));

  const enviar = form.handleSubmit(async (valores) => {
    if (!producto) return;

    const cambios = cambiosDe(producto, valores);
    if (Object.keys(cambios).length === 0) {
      volver();
      return;
    }

    setError(null);
    try {
      await editarProducto({ id, datos: cambios }).unwrap();
      volver();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  return {
    producto,
    cargando,
    categorias,
    tipos,
    control: form.control,
    enfocar: form.setFocus,
    enviar,
    enviando: form.formState.isSubmitting,
    error,
    fotos,
  };
}
