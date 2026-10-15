import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';

export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro';

const PREFERENCIAS: readonly PreferenciaTema[] = ['sistema', 'claro', 'oscuro'];
const CLAVE = 'preferencia-tema';

interface PreferenciaTemaState {
  preferencia: PreferenciaTema;
}

function leerPreferencia(): PreferenciaTema {
  const guardada = storageService.general.leer(CLAVE);
  return PREFERENCIAS.find((preferencia) => preferencia === guardada) ?? 'sistema';
}

/** Lo llama la persistencia de `@/store` cada vez que cambia la preferencia */
export function guardarPreferenciaTema(preferencia: PreferenciaTema): void {
  storageService.general.guardar(CLAVE, preferencia);
}

const preferenciaTemaSlice = createSlice({
  name: 'preferenciaTema',
  initialState: (): PreferenciaTemaState => ({ preferencia: leerPreferencia() }),
  reducers: {
    cambiarPreferencia: (state, action: PayloadAction<PreferenciaTema>) => {
      state.preferencia = action.payload;
    },
  },
});

export const { cambiarPreferencia } = preferenciaTemaSlice.actions;
export const preferenciaTemaReducer = preferenciaTemaSlice.reducer;
