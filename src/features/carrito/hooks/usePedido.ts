import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useAnticipaciones, useEsNavidad } from '@/features/catalogo';
import type { ApiError } from '@/services/api';
import { formatearDia, mesDeDia, nombreDelMes, sumarDias, sumarMeses, textoAnticipacion } from '@/shared/utils';
import { useCrearPedidoMutation } from '../api/carritoApi';
import { formularioPedidoSchema } from '../schemas';
import { alternativasDeDia, diaDisponible, diasDelCalendario, mesesDeLaEntrega } from '../entrega';
import { mensajeParaCliente } from '../errores';
import { cobroDelPedido, entregaDelDia } from '../sena';
import { pedidoConfirmado } from '../store/carritoSlice';
import type { FormularioPedido } from '../types';
import { useCarrito } from './useCarrito';
import type { OpcionDia } from '../components/HojaDiaLleno';
import { useCotizacion } from './useCotizacion';

/** La página «Tu pedido»: el carrito con los precios de hoy, los datos del cliente y confirmar */
export function usePedido() {
  const router = useRouter();
  const carrito = useCarrito();
  const { cotizacion, cotizando, error: errorCotizacion, quitados, refrescar } = useCotizacion(carrito.items);
  const [crearPedido, { isLoading: enviando }] = useCrearPedidoMutation();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  // Guardado: sobrevive a que el cliente se vaya a pagar la seña y el navegador descargue la pestaña
  const confirmado = useAppSelector((estado) => estado.carrito.confirmado);
  const { anticipacionDe, refrescar: refrescarAnticipaciones } = useAnticipaciones();

  const form = useForm<FormularioPedido>({
    resolver: zodResolver(formularioPedidoSchema),
    defaultValues: { nombre: '', telefono: '', nota: '', conEnvio: false, fechaEntrega: '' },
  });

  // ── El día: los que se pueden elegir los dice la cotización (cambian con el carrito) ──
  const disponible = cotizacion?.entrega ?? null;
  const fechaEntrega = useWatch({ control: form.control, name: 'fechaEntrega' });
  /** El mes que muestra el calendario. null = el del primer día que puede elegir */
  const [mesElegido, setMesElegido] = useState<string | null>(null);
  /** El día lleno que tocó: abre la hoja que le ofrece el día de antes y el de después */
  const [diaLleno, setDiaLleno] = useState<string | null>(null);
  const alternativas = diaLleno && disponible ? alternativasDeDia(diaLleno, disponible) : null;
  const elegirDia = (dia: string) => {
    setDiaLleno(null);
    setMesElegido(mesDeDia(dia));
    form.setValue('fechaEntrega', dia, { shouldValidate: true });
  };
  const meses = disponible ? mesesDeLaEntrega(disponible) : null;
  const mes = meses ? (mesElegido && mesElegido >= meses.primero && mesElegido <= meses.ultimo ? mesElegido : meses.primero) : null;

  // Sumó un producto de 48 hs o el dueño llenó ese día: el que había elegido ya no vale, tiene que elegir otro
  useEffect(() => {
    if (disponible && fechaEntrega && !diaDisponible(fechaEntrega, disponible)) {
      form.setValue('fechaEntrega', '', { shouldValidate: true });
    }
  }, [disponible, fechaEntrega, form]);

  // El candado: `enviando` llega un render tarde y tres toques en el mismo instante alcanzaban a mandar tres pedidos
  const confirmando = useRef(false);
  // La clave del intento: la misma hasta que el pedido sale. Si se cortó la conexión después de que el back lo guardó y
  // el cliente vuelve a confirmar, el back reconoce la clave y responde ese pedido en vez de crear otro
  const intento = useRef<string | null>(null);

  const enviar = async ({ nombre, telefono, nota, conEnvio, fechaEntrega }: FormularioPedido) => {
    if (confirmando.current) return;
    confirmando.current = true;
    intento.current ??= claveDeIntento();
    setError(null);
    try {
      const pedido = await crearPedido({
        cliente: { nombre, telefono },
        items: carrito.items,
        nota: nota || undefined,
        conEnvio,
        fechaEntrega,
        intento: intento.current,
      }).unwrap();
      intento.current = null;
      dispatch(pedidoConfirmado(pedido));
      form.reset();
    } catch (e) {
      // Algo se pausó entre que armó el carrito y confirmó (400), o el dueño llenó ese día (409): se vuelve a cotizar,
      // lo que no está se saca solo y, si el día ya no vale, se borra para que elija otro
      const status = (e as Partial<ApiError>).status;
      if (status === 400 || status === 409) void refrescar();
      setError(mensajeParaCliente(e));
    } finally {
      confirmando.current = false;
    }
  };
  // `handleSubmit` se arma al tocar, no al renderizar: así los refs del candado solo se leen en el toque
  const confirmar = () => form.handleSubmit(enviar)();

  const navidad = useEsNavidad();

  return {
    carrito,
    /** La web está de Navidad: el pedido suma sus dibujos y detalles de fiestas */
    navidad,
    cotizacion,
    cotizando,
    errorCotizacion,
    quitados,
    refrescar: async () => {
      await Promise.all([refrescar(), refrescarAnticipaciones()]);
    },
    /** La seña y el resto del carrito; null mientras se cotiza un cambio */
    cobro: cotizacion && !cotizando ? cobroDelPedido(cotizacion.total) : null,
    /**
     * Si la cotización falló, igual se muestra lo que eligió: el nombre sale del catálogo (la consulta de las
     * anticipaciones) y, si no está ahí, un genérico. Sin precio: lo da la cotización
     */
    itemsSinCotizar: carrito.items.map(({ productoId }) => ({
      productoId,
      nombre: anticipacionDe(productoId)?.nombre ?? PRODUCTO_SIN_NOMBRE,
    })),
    /** «Con 48 hs de anticipación» para cada producto; null si se pide en el momento o todavía no se sabe */
    anticipacionDe: (productoId: string) => {
      const anticipacion = anticipacionDe(productoId);
      return anticipacion ? textoAnticipacion(anticipacion.horas) : null;
    },
    /** «Para el sábado 21 de noviembre», arriba del botón de confirmar. null mientras no eligió */
    diaElegido: fechaEntrega ? `Para el ${formatearDia(fechaEntrega)}` : null,
    /** El calendario de «¿Para qué día?». null mientras no hay cotización */
    calendario:
      disponible && mes && meses
        ? {
            mes,
            dias: diasDelCalendario(mes, disponible),
            alRechazar: (_mensaje: string, dia: string) => setDiaLleno(dia),
            alElegir: elegirDia,
            alMesAnterior: mes > meses.primero ? () => setMesElegido(sumarMeses(mes, -1)) : undefined,
            alMesSiguiente: mes < meses.ultimo ? () => setMesElegido(sumarMeses(mes, 1)) : undefined,
            // En el último mes que se puede elegir: hasta qué día y que el mes siguiente se abre más adelante
            aviso: mes === meses.ultimo ? avisoHasta(disponible.hasta) : null,
          }
        : null,
    /** La hoja del día lleno: el mensaje y, para elegir con un toque, el día libre de antes y el de después */
    diaLleno: {
      visible: alternativas !== null,
      cerrar: () => setDiaLleno(null),
      opciones: [
        alternativas?.antes && { dia: alternativas.antes, titulo: 'El día antes', texto: formatearDia(alternativas.antes), antes: true },
        alternativas?.despues && {
          dia: alternativas.despues,
          titulo: 'El día después',
          texto: formatearDia(alternativas.despues),
          antes: false,
        },
      ].filter((opcion): opcion is OpcionDia => Boolean(opcion)),
      elegir: elegirDia,
    },
    /** Lo mismo, del pedido ya confirmado (el carrito ya se vació) */
    cobroConfirmado: confirmado ? cobroDelPedido(confirmado.total) : null,
    entregaConfirmado: confirmado ? entregaDelDia(confirmado.fechaEntrega) : null,
    form,
    confirmar,
    enviando,
    error,
    confirmado,
    // Si se entró directo (un link), no hay a dónde volver: va al catálogo
    volver: () => (router.canGoBack() ? router.back() : router.replace('/')),
    verCatalogo: () => router.replace('/'),
  };
}

/** El nombre de un producto del carrito que no se encontró en el catálogo (todavía carga, o ya no está) */
const PRODUCTO_SIN_NOMBRE = 'Producto de tu pedido';

/**
 * Debajo del calendario, en el último mes que se puede elegir: «Por ahora podés elegir hasta el lunes 30 de
 * noviembre. Los días de diciembre se abren más adelante.». Sale de `hasta`, que lo calcula el back
 */
function avisoHasta(hasta: string): string {
  const siguiente = mesDeDia(sumarDias(hasta, 1));
  // «diciembre de 2026» → «diciembre». Si `hasta` no es fin de mes, los días que faltan son del mismo mes
  const despues =
    siguiente === mesDeDia(hasta) ? 'Los días que siguen' : `Los días de ${nombreDelMes(siguiente).replace(/ de \d{4}$/, '')}`;
  return `Por ahora podés elegir hasta el ${formatearDia(hasta)}. ${despues} se abren más adelante.`;
}

/** Una clave al azar para el intento de confirmar (32 letras y números). `randomUUID` está en todo navegador con https */
function claveDeIntento(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
