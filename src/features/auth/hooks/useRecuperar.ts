import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useAppSelector } from '@/store';
import { usePedirCodigoMutation } from '../api/authApi';
import { recuperarSchema } from '../schemas';
import type { RecuperarDatos } from '../types';

export function useRecuperar() {
  const router = useRouter();
  const emailAnterior = useAppSelector((s) => s.recuperacion.email);
  const [pedirCodigo] = usePedirCodigoMutation();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RecuperarDatos>({
    resolver: zodResolver(recuperarSchema),
    defaultValues: { email: emailAnterior ?? '' },
  });

  const enviar = form.handleSubmit(async ({ email }) => {
    setError(null);
    try {
      await pedirCodigo(email).unwrap();
      router.push('/restablecer');
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  return {
    control: form.control,
    enviar,
    enviando: form.formState.isSubmitting,
    error,
    volver,
  };
}
