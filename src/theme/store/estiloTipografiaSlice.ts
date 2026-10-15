import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';
import type { EstiloTipografia } from '../types';

const VALORES: readonly EstiloTipografia[] = ['clasica', 'artesanal', 'delicada'];
export const ESTILO_TIPOGRAFIA_POR_DEFECTO: EstiloTipografia = 'clasica';
const CLAVE = 'estilo-tipografia';

interface EstiloTipografiaState {
  estilo: EstiloTipografia;
}

function leerEstilo(): EstiloTipografia {
  const guardado = storageService.general.leer(CLAVE);
  return VALORES.find((estilo) => estilo === guardado) ?? ESTILO_TIPOGRAFIA_POR_DEFECTO;
}

/** Lo llama la persistencia de `@/store` cada vez que cambia el estilo */
export function guardarEstiloTipografia(estilo: EstiloTipografia): void {
  storageService.general.guardar(CLAVE, estilo);
}

const estiloTipografiaSlice = createSlice({
  name: 'estiloTipografia',
  initialState: (): EstiloTipografiaState => ({ estilo: leerEstilo() }),
  reducers: {
    cambiarEstiloTipografia: (state, action: PayloadAction<EstiloTipografia>) => {
      state.estilo = action.payload;
    },
  },
});

export const { cambiarEstiloTipografia } = estiloTipografiaSlice.actions;
export const estiloTipografiaReducer = estiloTipografiaSlice.reducer;
