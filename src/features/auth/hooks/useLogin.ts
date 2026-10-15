import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useLoginMutation } from '../api/authApi';
import { loginSchema } from '../schemas';
import type { LoginDatos } from '../types';

export function useLogin() {
  const [login] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginDatos>({
    resolver: zodResolver(loginSchema),
    defaultValues: { usuario: '', password: '' },
  });

  // Si sale bien no hay que navegar: el layout de (admin) ve la sesión y muestra las pestañas
  const enviar = form.handleSubmit(async (datos) => {
    setError(null);
    try {
      await login(datos).unwrap();
    } catch (e) {
      setError(mensajeDeError(e));
      form.resetField('password');
    }
  });

  return {
    control: form.control,
    enfocar: form.setFocus,
    enviar,
    enviando: form.formState.isSubmitting,
    error,
  };
}
