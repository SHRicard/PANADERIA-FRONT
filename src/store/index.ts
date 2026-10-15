import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { recuperacionReducer } from '@/features/auth/store/recuperacionSlice';
import { guardarToken, sesionReducer } from '@/features/auth/store/sesionSlice';
import { estiloBarraReducer, guardarEstiloBarra } from '@/features/navegacion/store/estiloBarraSlice';
import { estiloEncabezadoReducer, guardarEstiloEncabezado } from '@/features/navegacion/store/estiloEncabezadoSlice';
import { subidaFotosReducer } from '@/features/productos/store/subidaFotosSlice';
import { baseApi } from '@/services/api';
import { estiloTipografiaReducer, guardarEstiloTipografia } from '@/theme/store/estiloTipografiaSlice';
import { guardarPreferenciaTema, preferenciaTemaReducer } from '@/theme/store/preferenciaTemaSlice';

const persistencia = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    sesion: sesionReducer,
    recuperacion: recuperacionReducer,
    preferenciaTema: preferenciaTemaReducer,
    estiloTipografia: estiloTipografiaReducer,
    estiloBarra: estiloBarraReducer,
    estiloEncabezado: estiloEncabezadoReducer,
    subidaFotos: subidaFotosReducer,
  },
  middleware: (getDefault) => getDefault().prepend(persistencia.middleware).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados: usá SIEMPRE estos, no los crudos de react-redux
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Lo que sobrevive a cerrar la app. MMKV es síncrono: cada slice lee lo guardado en su estado inicial,
// así que no hace falta rehidratar. Acá solo se guarda cada vez que el valor cambia.
const escuchar = persistencia.startListening.withTypes<RootState, AppDispatch>();

function persistir<T>(seleccionar: (estado: RootState) => T, guardar: (valor: T) => void) {
  escuchar({
    predicate: (_accion, actual, anterior) => seleccionar(actual) !== seleccionar(anterior),
    effect: (_accion, { getState }) => guardar(seleccionar(getState())),
  });
}

persistir((estado) => estado.sesion.token, guardarToken);
persistir((estado) => estado.preferenciaTema.preferencia, guardarPreferenciaTema);
persistir((estado) => estado.estiloTipografia.estilo, guardarEstiloTipografia);
persistir((estado) => estado.estiloBarra.estilo, guardarEstiloBarra);
persistir((estado) => estado.estiloEncabezado.estilo, guardarEstiloEncabezado);
