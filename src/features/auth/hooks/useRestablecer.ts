import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError } from '@/services/api';
import { useAppSelector } from '@/store';
import { usePedirCodigoMutation, useRestablecerMutation } from '../api/authApi';
import { restablecerSchema } from '../schemas';
import type { RestablecerFormulario } from '../types';
import { formatearSegundos, useCuentaRegresiva } from './useCuentaRegresiva';

// Lo mismo que tarda en llegar un email, más o menos: antes de eso reenviar solo suma confusión
const ESPERA_REENVIO_MS = 60_000;

export function useRestablecer() {
  const router = useRouter();
  const email = useAppSelector((s) => s.recuperacion.email);
  const pedidoEn = useAppSelector((s) => s.recuperacion.pedidoEn);
  const [pedirCodigo, { isLoading: reenviando }] = usePedirCodigoMutation();
  const [restablecer] = useRestablecerMutation();

  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const segundosParaReenviar = useCuentaRegresiva(pedidoEn ? pedidoEn + ESPERA_REENVIO_MS : null);

  const form = useForm<RestablecerFormulario>({
    resolver: zodResolver(restablecerSchema),
    defaultValues: { codigo: '', password: '', confirmacion: '' },
  });

  // Si sale bien no hay que navegar: con la sesión iniciada, el layout de (admin) muestra el panel
  const enviar = form.handleSubmit(async ({ codigo, password }) => {
    if (!email) return;
    setError(null);
    setAviso(null);
    try {
      await restablecer({ email, codigo, password }).unwrap();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  const reenviar = async () => {
    if (!email) return;
    setError(null);
    setAviso(null);
    try {
      await pedirCodigo(email).unwrap();
      form.resetField('codigo');
      setAviso(`Te mandamos un código nuevo a ${email}. El anterior ya no sirve.`);
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  return {
    email,
    control: form.control,
    enfocar: form.setFocus,
    enviar,
    enviando: form.formState.isSubmitting,
    error,
    aviso,
    reenviar,
    reenviando,
    puedeReenviar: segundosParaReenviar === 0,
    esperaReenvio: formatearSegundos(segundosParaReenviar),
    pedirOtroCodigo: () => router.replace('/recuperar'),
  };
}
