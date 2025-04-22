import axios, { AxiosRequestConfig } from "axios"
import { reduxStore, RootState, AppDispatch } from "./reduxStore" // Import Redux store, RootState, AppDispatch
import { updateAppData, clearAppDataKey, CacheEntry } from "./appSlice" // Import actions and CacheEntry type
import { getToken } from "@/utils/user/utilsUser" // Import getToken

// Type for listener callbacks remains the same
type ListenerCallback<T = any> = (event: { type: string; payload: T }) => void

// Base store type with listen/trigger
export type BaseStore = {
  listen: (callback: ListenerCallback) => () => void
  trigger: <P>(eventType: string, payload: P) => void
}

// Enhanced store type including Redux interaction methods and name
export interface EnhancedStore extends BaseStore {
  name: string // Store name used as prefix for Redux keys
  // Reads CacheEntry structure directly from Redux state
  getData: <T = any>(key: string) => CacheEntry<T> | undefined
  // Writes { data, timestamp } structure to Redux state
  setData: <T = any>(key: string, value: T) => void
  // Resets (sets to null) a specific cache entry in Redux state
  resetData: (key: string) => void
}

// Modified createStore function
export function createStore<T extends { name: string } & Record<string, any>>(
  methodsFactory: (store: Omit<EnhancedStore, "name">) => T // Factory receives store without name initially
): EnhancedStore & T {
  const listeners: { callback: ListenerCallback; listenerId: symbol }[] = []

  // --- Method Implementations ---

  const getData = <TData = any>(key: string): CacheEntry<TData> | undefined => {
    const storeName = combinedStore?.name
    if (!storeName) {
      console.error(
        "Store name is not available yet in getData. This indicates an issue."
      )
      return undefined
    }
    const reduxKey = `${storeName}_${key}`
    const state = reduxStore.getState() as RootState
    const value = state.appData?.appData?.[reduxKey] as
      | CacheEntry<TData>
      | undefined
    return value
  }

  const setData = <TData = any>(key: string, value: TData): void => {
    const storeName = combinedStore?.name
    if (!storeName) {
      console.error(
        "Store name is not available yet in setData. This indicates an issue."
      )
      return
    }
    const reduxKey = `${storeName}_${key}`
    const cacheValue: NonNullable<CacheEntry<TData>> = {
      data: value,
      timestamp: Date.now(),
    }
    reduxStore.dispatch(updateAppData({ [reduxKey]: cacheValue }))
  }

  const resetData = (key: string): void => {
    const storeName = combinedStore?.name
    if (!storeName) {
      console.error(
        "Store name is not available yet in resetData. This indicates an issue."
      )
      return
    }
    const reduxKey = `${storeName}_${key}`
    reduxStore.dispatch(clearAppDataKey(reduxKey)) // Dispatch action to set cache entry to null
  }

  const listen = (callback: ListenerCallback): (() => void) => {
    const listenerId = Symbol()

    // Wrapper callback that intercepts cacheable events to update cache
    const wrapperCallback = (event: { type: string; payload: any }) => {
      if (
        event.payload?.source === "network" &&
        event.payload?.cacheConfig?.id &&
        event.payload?.data !== undefined
      ) {
        const storeName = combinedStore.name
        const cacheId = event.payload.cacheConfig.id
        // Use the injected setData to update the cache, ensuring correct structure and timestamp
        setData(cacheId, event.payload.data)
      }

      // Call the original user-provided callback
      callback && callback(event)
    }

    listeners.push({ callback: wrapperCallback, listenerId })

    // Return unsubscribe function
    return () => {
      const index = listeners.findIndex((l) => l.listenerId === listenerId)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  const trigger = <TPayload>(eventType: string, payload: TPayload): void => {
    listeners.slice().forEach(({ callback }) => {
      try {
        callback({ type: eventType, payload })
      } catch (error) {
        console.error("Error in listener callback:", error)
      }
    })
  }

  // --- Store Assembly ---

  // Base store part (methods available to the factory function)
  const baseStorePart: Omit<EnhancedStore, "name"> = {
    listen,
    trigger,
    getData, // Provide getData
    setData, // Provide setData
    resetData, // Provide resetData
  }

  // Create the specific methods part
  const specificMethods = methodsFactory(baseStorePart)

  // Combine base and specific parts
  const combinedStore = {
    ...baseStorePart,
    ...specificMethods,
    name: specificMethods.name, // Ensure name is present
  } as EnhancedStore & T // Assert the final type

  // Runtime validation for 'name'
  if (!combinedStore.name || typeof combinedStore.name !== "string") {
    throw new Error(
      "Store created without a valid 'name' property. The methodsFactory must return an object including a string 'name'."
    )
  }

  return combinedStore
}

// --- Fetch Utilities ---

// Updated FetchOptions interface
interface FetchOptions<TPayload = any> {
  store: EnhancedStore // Use the enhanced store type
  endpoint: string
  cache?: { id: string; time: number } // Optional cache config { id, time_ms }. time: -1 means never expires.
  // forceFetch removed
  payload?: TPayload
  filter?: Record<string, any>
  eventOk: string
  eventKO: string
  axiosConfig?: AxiosRequestConfig
  securityCode?: any
  isPublic?: boolean
}

// --- Modified fetchGetWithTriggers ---
export async function fetchGetWithTriggers({
  store,
  endpoint,
  filter = {},
  eventOk,
  eventKO,
  axiosConfig,
  cache, // Destructure cache config
  isPublic, // Receive isPublic
}: FetchOptions) {
  // 1. Check cache (only if cache config exists)
  if (cache) {
    // Use the injected getData method
    const cachedEntry = store.getData(cache.id)

    // Check if cache entry is valid
    const isCacheValid =
      cachedEntry && // Entry exists and is not null
      (cache.time === -1 || // Cache never expires OR
        (cachedEntry.timestamp && // Timestamp exists AND
          Date.now() - cachedEntry.timestamp < cache.time)) // Not expired

    if (isCacheValid) {
      // Cache is valid
      store.trigger(eventOk, { data: cachedEntry.data, source: "cache" }) // Trigger with cached data
      return // Stop execution, serve from cache
    }
  }

  // 2. Fetch from network if cache is invalid or not used
  try {
    const finalAxiosConfig = { ...(axiosConfig || {}) }
    finalAxiosConfig.headers = { ...(finalAxiosConfig.headers || {}) }

    if (isPublic !== true) {
      const token = getToken()
      if (token) {
        finalAxiosConfig.headers["Authorization"] = `Bearer ${token}`
      }
    }

    const actualEndpoint = mapPublicEndpointToVersion(endpoint)
    const params = new URLSearchParams(filter).toString()
    const url = `${actualEndpoint}${params ? `?${params}` : ""}`
    const { data } = await axios.get(url, finalAxiosConfig) // Use finalAxiosConfig

    // 3. Trigger OK event - include cacheConfig so listener can update cache
    store.trigger(eventOk, { data, source: "network", cacheConfig: cache })
  } catch (error) {
    // 4. Trigger KO event on error
    store.trigger(eventKO, { error })
  }
}

// --- Update other fetch functions signatures (no cache logic added yet) ---
// Removed forceFetch parameter if it existed implicitly

export async function fetchPostWithTriggers<TPayload = any>({
  store,
  endpoint,
  payload,
  eventOk,
  eventKO,
  axiosConfig,
  isPublic, // Receive isPublic
}: FetchOptions<TPayload>) {
  try {
    const finalAxiosConfig = { ...(axiosConfig || {}) }
    finalAxiosConfig.headers = { ...(finalAxiosConfig.headers || {}) }

    if (isPublic !== true) {
      const token = getToken()
      if (token) {
        finalAxiosConfig.headers["Authorization"] = `Bearer ${token}`
      }
    }

    const actualEndpoint = mapPublicEndpointToVersion(endpoint)
    const { data } = await axios.post(actualEndpoint, payload, finalAxiosConfig) // Use finalAxiosConfig
    store.trigger(eventOk, { data, source: "network" })
  } catch (error) {
    store.trigger(eventKO, { error })
  }
}

export async function fetchPutWithTriggers<TPayload = any>({
  store,
  endpoint,
  payload,
  eventOk,
  eventKO,
  axiosConfig,
  isPublic, // Receive isPublic
}: FetchOptions<TPayload>) {
  try {
    const finalAxiosConfig = { ...(axiosConfig || {}) }
    finalAxiosConfig.headers = { ...(finalAxiosConfig.headers || {}) }

    if (isPublic !== true) {
      const token = getToken()
      if (token) {
        finalAxiosConfig.headers["Authorization"] = `Bearer ${token}`
      }
    }

    const actualEndpoint = mapPublicEndpointToVersion(endpoint)
    const { data } = await axios.put(actualEndpoint, payload, finalAxiosConfig) // Use finalAxiosConfig
    store.trigger(eventOk, { data, source: "network" })
  } catch (error) {
    store.trigger(eventKO, { error })
  }
}

export async function fetchDeleteWithTriggers({
  store,
  endpoint,
  filter = {},
  eventOk,
  eventKO,
  axiosConfig,
  isPublic, // Receive isPublic
}: FetchOptions) {
  try {
    const finalAxiosConfig = { ...(axiosConfig || {}) }
    finalAxiosConfig.headers = { ...(finalAxiosConfig.headers || {}) }

    if (isPublic !== true) {
      const token = getToken()
      if (token) {
        finalAxiosConfig.headers["Authorization"] = `Bearer ${token}`
      }
    }

    const actualEndpoint = mapPublicEndpointToVersion(endpoint)
    const params = new URLSearchParams(filter).toString()
    const url = `${actualEndpoint}${params ? `?${params}` : ""}`
    const { data } = await axios.delete(url, finalAxiosConfig) // Use finalAxiosConfig
    store.trigger(eventOk, { data, source: "network" })
  } catch (error) {
    store.trigger(eventKO, { error })
  }
}

// --- mapPublicEndpointToVersion and transformEndpointToV3 remain the same ---

export const mapPublicEndpointToVersion = (endpoint: string): string => {
  const accessMode = process.env.NEXT_PUBLIC_V3_ACCESS_MODE || "disabled"

  const isEndpointBusiness =
    endpoint.includes("business") || endpoint.includes("merchant")

  const shouldUseV3 = (() => {
    switch (accessMode) {
      case "physical":
        return !isEndpointBusiness
      case "companies":
        return isEndpointBusiness
      case "all":
        return true
      default:
        return false
    }
  })()

  return shouldUseV3
    ? process.env.NEXT_PUBLIC_API_URL + transformEndpointToV3(endpoint)
    : process.env.NEXT_PUBLIC_API_URL + endpoint
}

/**
 * Convierte un endpoint de v1/v2 a v3 si corresponde.
 * @param endpoint - El endpoint original.
 * @returns El endpoint actualizado a V3 si aplica.
 */
export const transformEndpointToV3 = (endpoint: string): string => {
  if (!endpoint.includes("/api/v3/")) {
    if (endpoint.startsWith("/api/v2/")) {
      return endpoint.replace("/api/v2/", "/api/v3/")
    } else if (endpoint.startsWith("/api/")) {
      return endpoint.replace("/api/", "/api/v3/")
    }
  }
  return endpoint
}
