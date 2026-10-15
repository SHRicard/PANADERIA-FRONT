import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storage';

/** Cómo se ve el encabezado de cada pestaña del admin. Lo elige el dueño en Más → Preferencias */
export type EstiloEncabezado = 'revista' | 'carta' | 'simple' | 'centrado' | 'icono';

const VALORES: readonly EstiloEncabezado[] = ['revista', 'carta', 'simple', 'centrado', 'icono'];
export const ESTILO_ENCABEZADO_POR_DEFECTO: EstiloEncabezado = 'revista';
const CLAVE = 'estilo-encabezado';

interface EstiloEncabezadoState {
  estilo: EstiloEncabezado;
}

function leerEstilo(): EstiloEncabezado {
  const guardado = storageService.general.leer(CLAVE);
  return VALORES.find((estilo) => estilo === guardado) ?? ESTILO_ENCABEZADO_POR_DEFECTO;
}

/** Lo llama la persistencia de `@/store` cada vez que cambia el estilo */
export function guardarEstiloEncabezado(estilo: EstiloEncabezado): void {
  storageService.general.guardar(CLAVE, estilo);
}

const estiloEncabezadoSlice = createSlice({
  name: 'estiloEncabezado',
  initialState: (): EstiloEncabezadoState => ({ estilo: leerEstilo() }),
  reducers: {
    cambiarEstiloEncabezado: (state, action: PayloadAction<EstiloEncabezado>) => {
      state.estilo = action.payload;
    },
  },
});

export const { cambiarEstiloEncabezado } = estiloEncabezadoSlice.actions;
export const estiloEncabezadoReducer = estiloEncabezadoSlice.reducer;
