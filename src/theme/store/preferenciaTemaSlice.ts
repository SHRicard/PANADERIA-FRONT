import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';

/**
 * Claro u oscuro (ya no hay «como el sistema»: lo sacó el dueño el 2026-11-13). El que elige el dueño en su app se
 * guarda también en el back (`tema` de los ajustes) y es el que ven todos los clientes en la web
 */
export type PreferenciaTema = 'claro' | 'oscuro';

const PREFERENCIAS: readonly PreferenciaTema[] = ['claro', 'oscuro'];
const CLAVE = 'preferencia-tema';

interface PreferenciaTemaState {
  preferencia: PreferenciaTema;
}

function leerPreferencia(): PreferenciaTema {
  const guardada = storageService.general.leer(CLAVE);
  // Lo guardado antes como «sistema» (o nada) arranca en claro, hasta que llegan los ajustes del back
  return PREFERENCIAS.find((preferencia) => preferencia === guardada) ?? 'claro';
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
