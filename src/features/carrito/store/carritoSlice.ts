import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';
import { carritoGuardadoSchema, pedidoCreadoSchema } from '../schemas';
import type { ItemCarrito, PedidoCreado } from '../types';

/** Los topes del back: hasta 30 productos distintos y hasta 50 unidades de cada uno */
export const MAX_PRODUCTOS = 30;
export const MAX_UNIDADES = 50;
const CLAVE = 'carrito';
const CLAVE_CONFIRMADO = 'pedido-confirmado';

interface CarritoState {
  items: ItemCarrito[];
  /**
   * El último pedido confirmado, con lo que hace falta para pagar la seña. Se guarda: si el cliente se va a
   * la app del banco y el navegador descarga la pestaña, al volver lo sigue viendo. Se olvida al empezar otro
   */
  confirmado: PedidoCreado | null;
}

// En la web es localStorage: el carrito sobrevive a recargar la página
function leerCarrito(): ItemCarrito[] {
  const guardado = storageService.general.leer(CLAVE);
  if (!guardado) return [];
  try {
    const resultado = carritoGuardadoSchema.safeParse(JSON.parse(guardado));
    return resultado.success ? resultado.data : [];
  } catch {
    return [];
  }
}

/** Lo llama la persistencia de `@/store` cada vez que cambia el carrito */
export function guardarCarrito(items: ItemCarrito[]): void {
  storageService.general.guardar(CLAVE, JSON.stringify(items));
}

function leerConfirmado(): PedidoCreado | null {
  const guardado = storageService.general.leer(CLAVE_CONFIRMADO);
  if (!guardado) return null;
  try {
    const resultado = pedidoCreadoSchema.safeParse(JSON.parse(guardado));
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}

/** Lo llama la persistencia de `@/store` cada vez que se confirma un pedido o se olvida */
export function guardarConfirmado(pedido: PedidoCreado | null): void {
  if (pedido) storageService.general.guardar(CLAVE_CONFIRMADO, JSON.stringify(pedido));
  else storageService.general.borrar(CLAVE_CONFIRMADO);
}

const tope = (cantidad: number) => Math.min(MAX_UNIDADES, Math.max(0, Math.round(cantidad)));

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: (): CarritoState => ({ items: leerCarrito(), confirmado: leerConfirmado() }),
  reducers: {
    /** Pone la cantidad de un producto. Con 0 lo saca; si es nuevo y ya hay 30 distintos, no entra */
    ponerCantidad: (state, action: PayloadAction<ItemCarrito>) => {
      const cantidad = tope(action.payload.cantidad);
      const indice = state.items.findIndex(({ productoId }) => productoId === action.payload.productoId);
      if (indice >= 0) {
        if (cantidad === 0) state.items.splice(indice, 1);
        else state.items[indice].cantidad = cantidad;
      } else if (cantidad > 0 && state.items.length < MAX_PRODUCTOS) {
        state.items.push({ productoId: action.payload.productoId, cantidad });
        // Empieza otro pedido: el confirmado ya no hace falta
        state.confirmado = null;
      }
    },
    /** Se confirmó: queda guardado para pagar la seña, y el carrito arranca vacío */
    pedidoConfirmado: (state, action: PayloadAction<PedidoCreado>) => {
      state.confirmado = action.payload;
      state.items = [];
    },
    /** Los que el back dijo que ya no se pueden pedir (pausados o eliminados) */
    quitarNoDisponibles: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(({ productoId }) => !action.payload.includes(productoId));
    },
  },
});

export const { pedidoConfirmado, ponerCantidad, quitarNoDisponibles } = carritoSlice.actions;
export const carritoReducer = carritoSlice.reducer;
