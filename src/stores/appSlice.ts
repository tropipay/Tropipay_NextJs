import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Define la estructura de una entrada de caché individual
export type CacheEntry<T = any> = { data: T; timestamp: number } | null

// Define la estructura del estado global de la caché
interface AppDataState {
  // Clave: string (ej: 'ProfileStore_profile'), Valor: CacheEntry o null
  [key: string]: CacheEntry<any>
}

interface GlobalState {
  appData: AppDataState
}

const initialState: GlobalState = {
  appData: {},
}

const appSlice = createSlice({
  name: "appData", // Nombre del slice
  initialState,
  reducers: {
    // Actualiza o añade una entrada de caché. El payload es un objeto
    // donde la clave es la key completa de Redux (ej: 'ProfileStore_profile')
    // y el valor es la estructura CacheEntry { data, timestamp }.
    updateAppData(
      state,
      action: PayloadAction<Record<string, NonNullable<CacheEntry>>> // No permitir null aquí
    ) {
      state.appData = { ...state.appData, ...action.payload }
    },
    // Borra una clave específica de la caché estableciéndola a null.
    // El payload es la clave completa de Redux (ej: 'ProfileStore_profile').
    clearAppDataKey(state, action: PayloadAction<string>) {
      state.appData[action.payload] = null
    },
  },
})

export const { updateAppData, clearAppDataKey } = appSlice.actions
export default appSlice.reducer
