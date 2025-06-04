import { env } from "@/config/env"
import { getToken } from "@/utils/user/utilsUser"
import axios, { AxiosRequestConfig } from "axios"
import { CacheEntry, clearAppDataKey, updateAppData } from "./appSlice"
import { reduxStore, RootState } from "./reduxStore"
import { getDeviceId } from "@/utils/data/fingerprintjs"

type ListenerCallback<T = any> = (event: {
  type: string
  data: T & { status?: number }
}) => void

export type BaseStore = {
  listen: (callback: ListenerCallback, key: string) => () => void
  trigger: <P extends { status?: number }>(
    eventType: string,
    payload: P
  ) => void
}

export interface EnhancedStore extends BaseStore {
  name: string
  getData: <T = any>(key: string) => CacheEntry<T> | undefined
  setData: <T = any>(key: string, value: T) => void
  resetData: (key: string) => void
}

export function createStore<T extends { name: string } & Record<string, any>>(
  methodsFactory: (store: Omit<EnhancedStore, "name">) => T // Factory receives store without name initially
): EnhancedStore & T {
  const listeners: {
    callback: ListenerCallback
    listenerId: symbol
    name: string
    key: string
  }[] = []

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

  const listen = (callback: ListenerCallback, key: string): (() => void) => {
    const existingListener = listeners.find(
      (l) => l.name === combinedStore.name && l.key === key
    )

    if (existingListener) {
      return () => {
        const index = listeners.findIndex(
          (l) => l.listenerId === existingListener.listenerId
        )
        if (index !== -1) {
          listeners.splice(index, 1)
        }
      }
    }

    const listenerId = Symbol()

    // Wrapper callback that intercepts cacheable events to update cache
    const wrapperCallback = (event: { type: string; data: any }) => {
      // Call the original user-provided callback
      callback && callback(event)
    }

    listeners.push({
      callback: wrapperCallback,
      listenerId,
      name: combinedStore.name,
      key,
    })

    // Return unsubscribe function
    return () => {
      const index = listeners.findIndex((l) => l.listenerId === listenerId)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  const trigger = <TData>(eventType: string, data: TData): void => {
    listeners.slice().forEach(({ callback }) => {
      try {
        callback({ type: eventType, data })
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
      store.trigger(eventOk, cachedEntry.data) // Trigger with cached data directly
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

    const actualEndpoint = env.API_URL + endpoint
    const params = new URLSearchParams(filter).toString()
    const url = `${actualEndpoint}${params ? `?${params}` : ""}`
    const deviceId = await getDeviceId()
    const response = await axios.get(url, {
      ...finalAxiosConfig,
      headers: {
        ...(finalAxiosConfig?.headers || {}),
        "X-DEVICE-ID": deviceId || "",
      },
    })

    // 3. Trigger OK event with full response
    store.trigger(eventOk, response.data)
  } catch (error) {
    // 4. Trigger KO event with error response if available
    const errorResponse = axios.isAxiosError(error) ? error.response : error
    const errorData = (errorResponse as any)?.data?.error || errorResponse
    store.trigger(eventKO, {
      // @ts-ignore
      error: { ...errorData, status: errorResponse?.status },
    } as any)
  }
}

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

    const actualEndpoint = env.API_URL + endpoint
    const deviceId = await getDeviceId()
    const response = await axios.post(actualEndpoint, payload, {
      ...finalAxiosConfig,
      headers: {
        ...(finalAxiosConfig?.headers || {}),
        "X-DEVICE-ID": deviceId || "",
      },
    })
    store.trigger(eventOk, response.data)
  } catch (error) {
    const errorResponse = axios.isAxiosError(error) ? error.response : error
    const errorData = (errorResponse as any)?.data?.error || errorResponse
    store.trigger(eventKO, {
      // @ts-ignore
      error: { ...errorData, status: errorResponse?.status },
    } as any)
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

    const actualEndpoint = env.API_URL + endpoint
    const deviceId = await getDeviceId()
    const response = await axios.put(actualEndpoint, payload, {
      ...finalAxiosConfig,
      headers: {
        ...(finalAxiosConfig?.headers || {}),
        "X-DEVICE-ID": deviceId || "",
      },
    })
    store.trigger(eventOk, response.data)
  } catch (error) {
    const errorResponse = axios.isAxiosError(error) ? error.response : error
    const errorData = (errorResponse as any)?.data?.error || errorResponse
    store.trigger(eventKO, {
      // @ts-ignore
      error: { ...errorData, status: errorResponse?.status },
    } as any)
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

    const actualEndpoint = env.API_URL + endpoint
    const params = new URLSearchParams(filter).toString()
    const url = `${actualEndpoint}${params ? `?${params}` : ""}`
    const deviceId = await getDeviceId()
    const response = await axios.delete(url, {
      ...finalAxiosConfig,
      headers: {
        ...(finalAxiosConfig?.headers || {}),
        "X-DEVICE-ID": deviceId || "",
      },
    })
    store.trigger(eventOk, response.data)
  } catch (error) {
    const errorResponse = axios.isAxiosError(error) ? error.response : error
    const errorData = (errorResponse as any)?.data?.error || errorResponse
    store.trigger(eventKO, {
      // @ts-ignore
      error: { ...errorData, status: errorResponse?.status },
    } as any)
  }
}

/**
 * Convierte un endpoint de v1/v2 a v3 si corresponde.
 * @param endpoint - El endpoint original.
 * @returns El endpoint actualizado a V3 si aplica.
 */
export const transformEndpointToV3 = (endpoint: string): string => {
  if (!endpoint.includes("/api/v3/")) {
    if (endpoint.startsWith("/api/v3/")) {
      return endpoint.replace("/api/v3/", "/api/v3/")
    } else if (endpoint.startsWith("/api/")) {
      return endpoint.replace("/api/", "/api/v3/")
    }
  }
  return endpoint
}
