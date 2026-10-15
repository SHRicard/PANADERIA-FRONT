import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

interface RecuperacionState {
  /** Email al que se mandó el último código. Sin esto no tiene sentido la pantalla del código */
  email: string | null;
  /** Cuándo se pidió el último código (ms), para no dejar reenviar enseguida */
  pedidoEn: number | null;
}

const initialState: RecuperacionState = { email: null, pedidoEn: null };

// No se persiste: si la app se cierra a mitad de camino, se vuelve a pedir el código
const recuperacionSlice = createSlice({
  name: 'recuperacion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.pedirCodigo.matchFulfilled, (state, action) => {
      state.email = action.meta.arg.originalArgs;
      state.pedidoEn = action.meta.fulfilledTimeStamp;
    });
  },
});

export const recuperacionReducer = recuperacionSlice.reducer;
