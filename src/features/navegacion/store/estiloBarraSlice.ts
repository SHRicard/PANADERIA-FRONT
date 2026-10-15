import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';

/** Cómo se ve la barra de pestañas del admin. Lo elige el dueño en Más → Preferencias */
export type EstiloBarra = 'completa' | 'flotante' | 'expandida' | 'piso' | 'capsula' | 'burbuja';

const VALORES: readonly EstiloBarra[] = ['completa', 'flotante', 'expandida', 'piso', 'capsula', 'burbuja'];
export const ESTILO_BARRA_POR_DEFECTO: EstiloBarra = 'completa';
const CLAVE = 'estilo-barra';

interface EstiloBarraState {
  estilo: EstiloBarra;
}

function leerEstilo(): EstiloBarra {
  const guardado = storageService.general.leer(CLAVE);
  return VALORES.find((estilo) => estilo === guardado) ?? ESTILO_BARRA_POR_DEFECTO;
}

/** Lo llama la persistencia de `@/store` cada vez que cambia el estilo */
export function guardarEstiloBarra(estilo: EstiloBarra): void {
  storageService.general.guardar(CLAVE, estilo);
}

const estiloBarraSlice = createSlice({
  name: 'estiloBarra',
  initialState: (): EstiloBarraState => ({ estilo: leerEstilo() }),
  reducers: {
    cambiarEstiloBarra: (state, action: PayloadAction<EstiloBarra>) => {
      state.estilo = action.payload;
    },
  },
});

export const { cambiarEstiloBarra } = estiloBarraSlice.actions;
export const estiloBarraReducer = estiloBarraSlice.reducer;
