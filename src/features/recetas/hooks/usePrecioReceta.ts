import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { mensajeDeError } from '@/services/api';
import { esSinReceta, useObtenerRecetaQuery, usePonerPrecioRecetaMutation } from '../api/recetasApi';
import { leerMultiplicador, opcionesDeRedondeo, precioDeVenta, redondearPrecio, type OpcionesDeRedondeo } from '../precio';
import { formularioPrecioSchema, MULTIPLICADORES_RAPIDOS, OTRO_MULTIPLICADOR } from '../schemas';
import type { ConfirmacionPrecio, EleccionRedondeo, FormularioPrecio } from '../types';

/** El multiplicador elegido; null mientras lo que escribió en «Otro» no sirve */
function multiplicadorDe({ eleccion, otro }: Partial<FormularioPrecio>): number | null {
  if (!eleccion) return null;
  return eleccion === OTRO_MULTIPLICADOR ? leerMultiplicador(otro ?? '') : Number(eleccion);
}

/** El redondeo que queda: «cerca» cae en «redondo» si los dos dan lo mismo; null = al peso */
function redondeoDe(eleccion: EleccionRedondeo | undefined, opciones: OpcionesDeRedondeo) {
  if (eleccion === 'cerca') return opciones.cerca ?? opciones.redondo;
  return eleccion === 'redondo' ? opciones.redondo : null;
}

/**
 * Cuál de las opciones de hoy se parece más al redondeo que usó la última vez: con 1000, $ 11.691 → $ 12.000 es el
 * más redondo. Si con ese redondeo el precio ya queda igual (era $ 12.000 justo), sin redondear
 */
function eleccionRedondeoInicial(guardado: number | null, exacto: number | null): EleccionRedondeo {
  if (guardado === null || exacto === null || exacto <= 0) return 'no';
  const { cerca, redondo } = opcionesDeRedondeo(exacto);
  const queda = redondearPrecio(exacto, guardado);
  if (queda === exacto) return 'no';
  if (cerca && queda <= cerca.precio) return 'cerca';
  return redondo ? 'redondo' : 'no';
}

/** Con qué arranca: el último multiplicador y redondeo que usó (si no está entre los rápidos, en «Otro») o ×3 la primera vez */
function inicial(guardado: number | null, redondeo: number | null, costo: number | null): FormularioPrecio {
  const rapido = MULTIPLICADORES_RAPIDOS.find((valor) => Number(valor) === guardado);
  const multiplicador: Pick<FormularioPrecio, 'eleccion' | 'otro'> =
    guardado === null
      ? { eleccion: '3', otro: '' }
      : rapido
        ? { eleccion: rapido, otro: '' }
        : { eleccion: OTRO_MULTIPLICADOR, otro: String(guardado).replace('.', ',') };
  const exacto = costo === null ? null : precioDeVenta(costo, guardado ?? 3);
  return { ...multiplicador, redondeo: eleccionRedondeoInicial(redondeo, exacto) };
}

const SIN_OPCIONES: OpcionesDeRedondeo = { cerca: null, redondo: null };

/**
 * Ponerle al producto el precio de venta que sale de su receta: lo que cuesta cada unidad × lo que elija el dueño,
 * y si quiere, redondeado para arriba. Muestra la cuenta mientras elige y la confirma en una hoja antes de guardar;
 * el precio final lo calcula el back (con el costo de ese momento)
 */
export function usePrecioReceta(productoId: string) {
  const router = useRouter();
  const consulta = useObtenerRecetaQuery(productoId);
  const sinReceta = esSinReceta(consulta.error);
  const receta = sinReceta ? undefined : consulta.data;
  const [ponerPrecio, { isLoading: guardando }] = usePonerPrecioRecetaMutation();
  const [error, setError] = useState<string | null>(null);
  // La hoja se cierra sin borrar los datos: así no se vacía mientras se va
  const [confirmacion, setConfirmacion] = useState<ConfirmacionPrecio | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  const costo = receta?.costoPorUnidad ?? null;
  const precioActual = receta?.producto.precio;

  const guardado = receta?.multiplicador ?? null;
  const redondeoGuardado = receta?.redondeo ?? null;
  const valores = useMemo(() => inicial(guardado, redondeoGuardado, costo), [guardado, redondeoGuardado, costo]);
  const form = useForm<FormularioPrecio>({
    resolver: zodResolver(formularioPrecioSchema),
    defaultValues: valores,
    // Arranca con lo último que usó apenas llega la receta, sin pisar lo que el dueño ya eligió
    values: receta ? valores : undefined,
    resetOptions: { keepDirtyValues: true },
  });
  const elegido = useWatch({ control: form.control });

  const multiplicador = multiplicadorDe(elegido);
  const exacto = costo !== null && multiplicador !== null ? precioDeVenta(costo, multiplicador) : null;
  const opciones = exacto !== null ? opcionesDeRedondeo(exacto) : SIN_OPCIONES;
  const redondeado = redondeoDe(elegido.redondeo, opciones);
  const precio = redondeado?.precio ?? exacto;
  // Mientras «Otro» no sirva, el botón sigue activo: al tocarlo, el error sale abajo del campo
  const igual = precio !== null && precio === precioActual;
  const daCero = exacto !== null && exacto <= 0;

  const actualizar = form.handleSubmit((datos) => {
    const nuevoMultiplicador = multiplicadorDe(datos);
    if (nuevoMultiplicador === null || costo === null || precioActual === undefined) return;
    const nuevoExacto = precioDeVenta(costo, nuevoMultiplicador);
    const conRedondeo = redondeoDe(datos.redondeo, opcionesDeRedondeo(nuevoExacto));
    setError(null);
    setConfirmacion({
      actual: precioActual,
      nuevo: conRedondeo?.precio ?? nuevoExacto,
      exacto: nuevoExacto,
      costo,
      multiplicador: nuevoMultiplicador,
      redondeo: conRedondeo?.redondeo ?? null,
    });
    setConfirmando(true);
  });

  const confirmar = async () => {
    if (!confirmacion) return;
    setError(null);
    try {
      await ponerPrecio({ productoId, multiplicador: confirmacion.multiplicador, redondeo: confirmacion.redondeo }).unwrap();
      // La receta y el producto ya tienen el precio nuevo en la caché. La hoja se va junto con la pantalla
      setConfirmando(false);
      router.back();
    } catch (e) {
      // 409: la receta ya no tiene costo o da $ 0 (si justo cambió un insumo). Se lee en la hoja
      setError(mensajeDeError(e));
    }
  };

  return {
    form,
    receta,
    /** Lo que cuesta hacer cada unidad; null si algún ingrediente no se puede calcular */
    costo,
    multiplicador,
    /** Lo que cuesta × el multiplicador, al peso; null mientras lo que escribió en «Otro» no sirve */
    exacto,
    /** El precio que va a quedar, ya redondeado si eligió redondear */
    precio,
    /** A qué múltiplo se redondea; null si queda al peso */
    redondeo: redondeado?.redondeo ?? null,
    /** Las opciones del Segmentado del redondeo, con su precio. Vacía si no hay cómo redondearlo */
    opcionesRedondeo:
      exacto !== null && opciones.redondo
        ? [
            { valor: 'no' as const, precio: exacto },
            ...(opciones.cerca ? [{ valor: 'cerca' as const, precio: opciones.cerca.precio }] : []),
            { valor: 'redondo' as const, precio: opciones.redondo.precio },
          ]
        : [],
    /** La que se ve elegida: «cerca» se ve como «redondo» si quedó una sola */
    eleccionRedondeo: (redondeado === null ? 'no' : redondeado === opciones.cerca ? 'cerca' : 'redondo') as EleccionRedondeo,
    /** Ya lo vende a ese precio: no hay nada que cambiar */
    igual,
    /** Una receta de cosas que no se compran (o casi gratis): el back no lo acepta */
    daCero,
    puedeActualizar: !igual && !daCero,
    /** Abre la hoja que confirma el precio nuevo */
    actualizar,
    confirmacion,
    confirmando,
    confirmar: () => void confirmar(),
    /** Mientras guarda no se cierra: el pedido ya salió */
    cancelar: () => {
      if (!guardando) setConfirmando(false);
    },
    guardando,
    error,
    cargando: consulta.isLoading,
    errorCarga: consulta.error && !sinReceta ? mensajeDeError(consulta.error) : null,
    reintentar: () => void consulta.refetch(),
  };
}
