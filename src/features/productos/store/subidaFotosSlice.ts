import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mensajeDeError, type ApiError } from '@/services/api';
import type { AppDispatch, RootState } from '@/store';
import { cambiarProductoEnCache, productosApi } from '../api/productosApi';
import type { FotoLocal } from '../types';

const SUBIDAS_A_LA_VEZ = 2;
const INTENTOS = 3;
// Entre intentos se espera 2 s, 4 s…
const ESPERA_BASE_MS = 2000;

export type EstadoFoto = 'pendiente' | 'subiendo' | 'error';

/** Una foto que todavía no está en el servidor. Las que suben bien salen de la cola */
export interface FotoEnCola extends FotoLocal {
  productoId: string;
  estado: EstadoFoto;
  error?: string;
}

interface SubidaFotosState {
  fotos: Record<string, FotoEnCola>;
}

const initialState: SubidaFotosState = { fotos: {} };

// La cola no se guarda: si se cierra la app, lo pendiente se pierde (lo ya subido queda en el producto)
const subidaFotosSlice = createSlice({
  name: 'subidaFotos',
  initialState,
  reducers: {
    encolar: (state, { payload }: PayloadAction<{ productoId: string; fotos: FotoLocal[] }>) => {
      for (const foto of payload.fotos) {
        state.fotos[foto.idLocal] = { ...foto, productoId: payload.productoId, estado: 'pendiente' };
      }
    },
    cambiarEstado: (state, { payload }: PayloadAction<{ idLocal: string; estado: EstadoFoto; error?: string }>) => {
      const foto = state.fotos[payload.idLocal];
      if (foto) Object.assign(foto, { estado: payload.estado, error: payload.error });
    },
    /** Se cortó la subida de un producto: lo que faltaba queda con error, para reintentar o descartar */
    cortarProducto: (state, { payload }: PayloadAction<{ productoId: string; error: string }>) => {
      for (const foto of Object.values(state.fotos)) {
        if (foto.productoId === payload.productoId && foto.estado === 'pendiente') {
          Object.assign(foto, { estado: 'error', error: payload.error });
        }
      }
    },
    /** Saca una foto de la cola: porque ya subió o porque el dueño la descarta */
    quitarFoto: (state, { payload }: PayloadAction<string>) => {
      delete state.fotos[payload];
    },
    /** Se borró el producto: lo que tenía en la cola ya no tiene a dónde ir */
    quitarFotosDeProducto: (state, { payload }: PayloadAction<string>) => {
      for (const foto of Object.values(state.fotos)) {
        if (foto.productoId === payload) delete state.fotos[foto.idLocal];
      }
    },
  },
});

const { encolar, cambiarEstado, cortarProducto } = subidaFotosSlice.actions;
export const { quitarFoto, quitarFotosDeProducto } = subidaFotosSlice.actions;
export const subidaFotosReducer = subidaFotosSlice.reducer;

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

type Resultado = 'lista' | 'error' | 'cortar';

/** Sube una foto con sus reintentos. Si sube, la agrega al producto en la caché: aparece sin recargar */
async function subirUna(dispatch: AppDispatch, productoId: string, foto: FotoLocal): Promise<Resultado> {
  for (let intento = 1; ; intento++) {
    dispatch(cambiarEstado({ idLocal: foto.idLocal, estado: 'subiendo' }));
    const pedido = dispatch(productosApi.endpoints.subirFoto.initiate({ productoId, foto }));
    try {
      const imagen = await pedido.unwrap();
      dispatch(
        cambiarProductoEnCache(productoId, (producto) =>
          // Puede estar ya: la respuesta de un cambio de portada la pudo haber traído
          producto.imagenes.some(({ id }) => id === imagen.id)
            ? producto
            : { ...producto, imagenes: [...producto.imagenes, imagen] }
        )
      );
      dispatch(quitarFoto(foto.idLocal));
      return 'lista';
    } catch (e) {
      const status = (e as Partial<ApiError>).status ?? null;
      const mensaje = mensajeDeError(e);

      // El producto ya no existe o venció la sesión: no tiene sentido seguir con este producto
      if (status === 404 || status === 401) {
        dispatch(cambiarEstado({ idLocal: foto.idLocal, estado: 'error', error: mensaje }));
        dispatch(cortarProducto({ productoId, error: mensaje }));
        return 'cortar';
      }
      // Sin conexión, timeout, Cloudinary (502) o el servidor (500): vale la pena reintentar.
      // Un 400 (no es imagen, pesa más de 10 MB, ya hay 10 fotos) no se arregla reintentando
      const reintentable = status === null || status >= 500;
      if (!reintentable || intento === INTENTOS) {
        dispatch(cambiarEstado({ idLocal: foto.idLocal, estado: 'error', error: mensaje }));
        return 'error';
      }
      await esperar(intento * ESPERA_BASE_MS);
    } finally {
      // El resultado ya se usó: que no quede guardado en el estado de RTK Query
      pedido.reset();
    }
  }
}

// Tipado con el store de la app: sin esto, `dispatch` no acepta los thunks de RTK Query.
// Es un import de tipos, así que no arma una dependencia circular con src/store
const crearThunk = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>();

/** Sube las fotos de un producto en segundo plano: la portada sola y después el resto de a 2 */
export const subirFotos = crearThunk(
  'subidaFotos/subir',
  async ({ productoId, fotos }: { productoId: string; fotos: FotoLocal[] }, { dispatch }) => {
    dispatch(encolar({ productoId, fotos }));

    // Con 2 a la vez, las fotos quedan en el orden en que terminan: mandando la portada primero, no cambia
    const [portada, ...resto] = fotos;
    if (!portada || (await subirUna(dispatch, productoId, portada)) === 'cortar') return;

    let siguiente = 0;
    let cortar = false;
    const trabajador = async () => {
      while (!cortar && siguiente < resto.length) {
        const foto = resto[siguiente++];
        if ((await subirUna(dispatch, productoId, foto)) === 'cortar') cortar = true;
      }
    };
    await Promise.all(Array.from({ length: Math.min(SUBIDAS_A_LA_VEZ, resto.length) }, trabajador));
  }
);

/** Vuelve a intentar una foto que quedó con error */
export const reintentarFoto = crearThunk('subidaFotos/reintentar', async (idLocal: string, { dispatch, getState }) => {
  const foto = getState().subidaFotos.fotos[idLocal];
  if (foto?.estado === 'error') await subirUna(dispatch, foto.productoId, foto);
});
