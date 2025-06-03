import { configureStore } from "@reduxjs/toolkit"
import appDataReducer from "./appSlice" // Importa el reducer del appSlice

export const reduxStore = configureStore({
  reducer: {
    // La clave aquí ('appData') define cómo se verá esta parte del estado global.
    // El estado completo será: { appData: { appData: { ... } } }
    // Coincide con el 'name' del slice.
    appData: appDataReducer,
  },
  // Opciones adicionales de middleware o devTools pueden ir aquí si son necesarias
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(miMiddlewarePersonalizado),
  // devTools: process.env.NODE_ENV !== 'production',
})

// Exporta tipos útiles para usar con TypeScript en la aplicación
// Inferir los tipos `RootState` y `AppDispatch` del propio store
export type RootState = ReturnType<typeof reduxStore.getState>
// Tipo inferido: {appData: GlobalState} (donde GlobalState es de appSlice.ts)
export type AppDispatch = typeof reduxStore.dispatch
