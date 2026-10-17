import { useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeDeError, type ApiError } from '@/services/api';
import { useBorrarDatosPagoMutation, useGuardarDatosPagoMutation, useObtenerDatosPagoQuery } from '../api/datosPagoApi';
import { formularioDatosPagoSchema } from '../schemas';
import type { FormularioDatosPago } from '../types';

const VACIO: FormularioDatosPago = { nombreCompleto: '', alias: '', cbu: '', billetera: '' };

/**
 * Billetera, en Más: la cuenta a la que los clientes le transfieren la seña al dueño. Es un solo juego de
 * datos: guardar reemplaza al anterior. Mientras no estén cargados, el back responde 404 y la web no los muestra
 */
export function useBilletera() {
  const consulta = useObtenerDatosPagoQuery();
  const [guardarDatosPago, { isLoading: guardando }] = useGuardarDatosPagoMutation();
  const [borrarDatosPago, { isLoading: borrando }] = useBorrarDatosPagoMutation();
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  // Un 404 no es una falla: todavía no los cargó
  const sinDatos = consulta.error !== undefined && (consulta.error as Partial<ApiError>).status === 404;

  const form = useForm<FormularioDatosPago>({
    resolver: zodResolver(formularioDatosPagoSchema),
    defaultValues: VACIO,
    // Se llena con lo guardado apenas llega, sin pisar lo que el dueño ya empezó a escribir
    values: consulta.data,
    resetOptions: { keepDirtyValues: true },
  });

  const guardar = form.handleSubmit(async (valores) => {
    setError(null);
    setGuardado(false);
    try {
      // El parse deja el CBU solo con los números, como lo guarda el back
      await guardarDatosPago(formularioDatosPagoSchema.parse(valores)).unwrap();
      setGuardado(true);
    } catch (e) {
      setError(mensajeDeError(e));
    }
  });

  const borrar = async () => {
    setError(null);
    setGuardado(false);
    try {
      await borrarDatosPago().unwrap();
      form.reset(VACIO);
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  return {
    control: form.control,
    enfocar: form.setFocus,
    cargando: consulta.isLoading,
    /** Todavía no los cargó: la web no muestra cómo transferir */
    sinDatos,
    errorCarga: consulta.isError && !sinDatos ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
    hayDatos: Boolean(consulta.data),
    guardar,
    guardando,
    guardado,
    error,
    borrando,
    // Se confirma: los clientes dejan de ver a dónde transferir la seña
    sacarDeLaWeb: () =>
      Alert.alert('Sacar los datos de la web', 'Los clientes van a dejar de ver a dónde transferirte la seña. Podés volver a cargarlos cuando quieras.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sacar de la web', style: 'destructive', onPress: () => void borrar() },
      ]),
  };
}
