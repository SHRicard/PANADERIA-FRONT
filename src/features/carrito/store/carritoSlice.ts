import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';
import { carritoGuardadoSchema } from '../schemas';
import type { ItemCarrito } from '../types';

/** Los topes del back: hasta 30 productos distintos y hasta 50 unidades de cada uno */
export const MAX_PRODUCTOS = 30;
export const MAX_UNIDADES = 50;
const CLAVE = 'carrito';

interface CarritoState {
  items: ItemCarrito[];
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

const tope = (cantidad: number) => Math.min(MAX_UNIDADES, Math.max(0, Math.round(cantidad)));

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: (): CarritoState => ({ items: leerCarrito() }),
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
      }
    },
    /** Los que el back dijo que ya no se pueden pedir (pausados o eliminados) */
    quitarNoDisponibles: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(({ productoId }) => !action.payload.includes(productoId));
    },
    vaciarCarrito: (state) => {
      state.items = [];
    },
  },
});

export const { ponerCantidad, quitarNoDisponibles, vaciarCarrito } = carritoSlice.actions;
export const carritoReducer = carritoSlice.reducer;
