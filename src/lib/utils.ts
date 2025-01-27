import { QueryKey } from "@tanstack/react-query"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUser } from "./utilsUser"

// Definimos un tipo para una función de búsqueda que toma un parámetro `T` y devuelve un endpoint
type FetchFunction<T extends any[]> = (...args: T) => { endpoint: string }

// Tipo de configuración para `useQuery`
type QueryConfig<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  initialData?: TData
  staleTime?: number
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

export const fetchHeaders: Record<string, string> = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

// Función para hacer un fetch GET con triggers
export const fetchGetWithTriggers = async (
  fetchGetData: FetchGetData,
  headerData: HeaderData = {}
): Promise<any> => {
  try {
    // Intenta obtener el usuario; en el servidor puede no estar disponible
    let user: UserSession
    try {
      user = await getUser()
    } catch (error) {
      console.warn("No se pudo obtener el usuario en el servidor:", error)
      user = {} // Default vacío si no se puede obtener en el servidor
    }

    const headers: Record<string, string> = {
      ...fetchHeaders,
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

export const parseParams = (params: { [key: string]: string }) => {
  const parsed: Record<string, any> = {}
  for (const [key, value] of Object.entries(params)) {
    try {
      parsed[key] = JSON.parse(value)
    } catch {
      parsed[key] = value
    }
  }
  return parsed
}
export const parseParamsString = (params: URLSearchParams) => {
  const result: Record<string, any> = {}

  params.forEach((value, key) => {
    try {
      const parsedValue = JSON.parse(decodeURIComponent(value))
      result[key] = parsedValue
    } catch {
      result[key] = decodeURIComponent(value)
    }
  })
  return result
}

export function urlParamsTyping(params: Record<string, any>) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        acc[key] = {
          data: value,
          type: "faceted",
        }
      } else if ("min" in value || "max" in value) {
        acc[key] = {
          ...value,
          type: "rangeAmount",
        }
      } else if ("from" in value || "to" in value) {
        acc[key] = {
          ...value,
          type: "date",
        }
      } else if ("data" in value) {
        acc[key] = {
          ...value,
          type: "singleValue",
        }
      } else {
        acc[key] = value
      }
    } else {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, any>)
}

export function urlParamsToFilter(processedParams: Record<string, any>) {
  return Object.entries(processedParams).reduce((acc, [keyRenamed, value]) => {
    const key = keyRenamed.substring(1)
    if (!value.type) {
      return acc
    }
    switch (value.type) {
      case "rangeAmount":
        if (value.min) acc[`${key}Gte`] = parseFloat(value.min)
        if (value.max) acc[`${key}Lte`] = parseFloat(value.max)
        break

      case "date":
        if (value.from) acc[`${key}From`] = value.from
        if (value.to) acc[`${key}To`] = value.to
        break

      case "singleValue":
        acc[key] = value.data
        break

      case "faceted":
        if (value.data && value.data.length > 0) {
          acc[key] = value.data[0] // Tomamos el primer valor del array
        }
        break
    }

    return acc
  }, {} as Record<string, any>)
}

export function generateHashedKey(key: string, obj: any): string {
  const str = JSON.stringify(obj)
  return `${key} | ${btoa(str)}`
}

export async function processQueryParameters(
  searchParams: Record<string, string>
) {
  try {
    const resolvedParams = await searchParams
    const queryString = new URLSearchParams()
    Object.entries(resolvedParams).forEach(([key, value]) => {
      queryString.append(key, value)
    })

    const urlParams = parseParams(Object.fromEntries(queryString.entries()))
    return urlParams
  } catch (error) {
    console.error("Error processing query parameters:", error)
    return {}
  }
}

export function selStyle(
  condition: boolean,
  classesTrue: string,
  classesFalse: string,
  commonStyle: string
): string {
  return condition ? classesTrue : classesFalse
}

export const formatAmount = (
  amount: number,
  currency: string = "",
  position: "left" | "right" = "left"
): string => {
  let formatter = ""

  if (currency === "") {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    }).format(amount / 100)
  } else {
    formatter =
      position !== "left"
        ? `${(amount / 100).toFixed(2)} ${currency}`
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
          }).format(amount / 100)
  }

  return formatter
}

export const truncateLabels = (
  options: string[],
  maxLength: number = 20
): string => {
  const concatenated = options.map((option) => option).join(", ")

  if (concatenated.length <= maxLength) {
    return concatenated
  }

  return concatenated.substring(0, maxLength - 3) + "..."
}
