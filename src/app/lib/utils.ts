import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUser } from "./utilsUser"
import { DehydratedState, QueryKey } from "@tanstack/react-query"

// Definimos un tipo para una función de búsqueda que toma un parámetro `T` y devuelve un endpoint
type FetchFunction<T extends any[]> = (...args: T) => { endpoint: string }

// Tipo de configuración para `useQuery`
type QueryConfig<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  initialData?: TData
  staleTime?: number
}

// Tipo de retorno de `setSSROptions`
type setSSROptions = Record<string, any>

// Tipo de retorno de `getUseQueryConfig`
type GetUseQueryConfigReturn<TData> = Required<QueryConfig<TData>>

export function setSSR<T extends any[], TData>(
  func: (...args: T) => Promise<TData>, // Función que devuelve una promesa con datos de tipo TData
  config: setSSROptions = {}, // Configuración adicional opcional
  args: T = [] as T // Argumentos para la función de búsqueda, con valor predeterminado
) {
  return {
    queryKey: [func.name, ...args] as QueryKey, // Generamos el queryKey usando el nombre de la función y los argumentos
    queryFn: () => func(...args), // Llamamos a la función con los argumentos proporcionados
    ...config, // Fusionamos la configuración adicional proporcionada
  }
}

export function getUseQueryConfig<T extends any[], TData>(
  func: FetchFunction<T>,
  dehydratedState: DehydratedState,
  args: T,
  staleTime = 1000 * 60 * 5
): GetUseQueryConfigReturn<TData> {
  const queryKey = [func.name, ...args] as QueryKey
  const { endpoint: fetchURL } = func(...args)

  return {
    queryKey,
    queryFn: async () => {
      const res = await fetch(fetchURL)
      if (!res.ok) throw new Error("Error fetching data")
      return (await res.json()) as TData
    },
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify(queryKey)
    )?.state?.data as TData,
    staleTime,
  }
}

// Función para combinar clases (cn)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Función para construir parámetros de consulta (queryParams)
const queryParams = (
  params: Record<string, string | number | boolean>
): string => {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

// Tipos para fetchGetData y headerData
interface FetchGetData {
  endpoint: string
  isPublic?: boolean
  filter?: Record<string, string | number | boolean>
}

interface HeaderData {
  [key: string]: string
}

// Función para hacer un fetch GET con triggers
export const fetchGetWithTriggers = async (
  fetchGetData: FetchGetData,
  headerData: HeaderData = {}
): Promise<any> => {
  try {
    // Intenta obtener el usuario; en el servidor puede no estar disponible
    let user
    try {
      user = await getUser()
    } catch (error) {
      console.warn("No se pudo obtener el usuario en el servidor:", error)
      user = {} // Default vacío si no se puede obtener en el servidor
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": user?.lang || "en",
    }

    for (const key in headerData) {
      headers[key] = headerData[key]
    }

    /*     let endpoint = `${process.env.REACT_APP_APP_URL || ""}${
      fetchGetData.endpoint
    }`
 */ let endpoint = `${fetchGetData.endpoint}`

    if (!fetchGetData.isPublic) {
      headers.Authorization = `Bearer ${user?.token || ""}`
    }

    if (fetchGetData.filter) {
      endpoint += "?" + queryParams(fetchGetData.filter)
    }

    const deviceId = "010101" // Simulado, reemplazar con fingerprint si es necesario

    const response = await fetch(endpoint, {
      headers: { ...headers, "X-DEVICE-ID": deviceId },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  } catch (err) {
    throw err
  }
}
