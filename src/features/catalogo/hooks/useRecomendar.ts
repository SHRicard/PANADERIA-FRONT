import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError, type ApiError } from '@/services/api';
import { useRecomendarMutation } from '../api/catalogoApi';
import { formularioRecomendacionSchema } from '../schemas';
import type { FormularioRecomendacion } from '../types';

/** Dejar estrellas (y, si quiere, unas palabras y su nombre) en un producto, sin login */
export function useRecomendar(productoId: string) {
  const [recomendar, { isLoading: enviando }] = useRecomendarMutation();
  const [error, setError] = useState<string | null>(null);
  const [enviada, setEnviada] = useState(false);

  const form = useForm<FormularioRecomendacion>({
    resolver: zodResolver(formularioRecomendacionSchema),
    defaultValues: { puntaje: 0, texto: '', autor: '' },
  });

  const enviar = form.handleSubmit(async ({ puntaje, texto, autor }) => {
    setError(null);
    try {
      // Vacíos no viajan: el back no los guarda
      await recomendar({ productoId, datos: { puntaje, texto: texto || undefined, autor: autor || undefined } }).unwrap();
      setEnviada(true);
      form.reset();
    } catch (e) {
      // Se pausó mientras lo miraba: el «No encontrado» del back no le dice nada al cliente
      setError(
        (e as Partial<ApiError>).status === 404 ? 'Este producto ya no está disponible para votar.' : mensajeDeError(e),
      );
    }
  });

  return {
    form,
    enviar,
    enviando,
    error,
    /** Ya dejó la suya: en vez del formulario va el «gracias» */
    enviada,
  };
}
