import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { sesionVencida } from '@/services/api';
import { storageService } from '@/services/storage';
import { authApi } from '../api/authApi';

const CLAVE_TOKEN = 'token';

interface SesionState {
  token: string | null;
}

/** Lo llama la persistencia de `@/store` cada vez que cambia el token */
export function guardarToken(token: string | null): void {
  if (token) storageService.seguro.guardar(CLAVE_TOKEN, token);
  else storageService.seguro.borrar(CLAVE_TOKEN);
}

const sesionSlice = createSlice({
  name: 'sesion',
  // El token se guarda en el storage cifrado. MMKV es síncrono: al abrir la app ya está cargado
  initialState: (): SesionState => ({ token: storageService.seguro.leer(CLAVE_TOKEN) }),
  reducers: {
    cerrarSesion: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Ante un 401 con token, el baseApi avisa y la sesión se cierra
      .addCase(sesionVencida, (state) => {
        state.token = null;
      })
      .addMatcher(
        isAnyOf(authApi.endpoints.login.matchFulfilled, authApi.endpoints.restablecer.matchFulfilled),
        (state, action) => {
          state.token = action.payload;
        }
      );
  },
});

export const { cerrarSesion } = sesionSlice.actions;
export const sesionReducer = sesionSlice.reducer;
